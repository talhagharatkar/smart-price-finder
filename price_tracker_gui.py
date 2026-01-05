import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import threading
from datetime import datetime
import json
import os

# Import your backend functions
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

class PriceComparisonApp:
    def __init__(self, root):
        self.root = root
        self.root.title("🛍️ Smart Price Tracker")
        self.root.geometry("1000x700")
        self.root.configure(bg='#f0f2f5')
        
        # Notification settings
        self.notifications_enabled = True
        self.target_price = None
        self.price_history = []
        
        # Setup GUI
        self.setup_gui()
        self.load_settings()
        
    def setup_gui(self):
        # Header Frame
        header_frame = tk.Frame(self.root, bg='#2c3e50', height=80)
        header_frame.pack(fill='x', padx=10, pady=10)
        header_frame.pack_propagate(False)
        
        title_label = tk.Label(header_frame, text="🛍️ SMART PRICE TRACKER", 
                              font=('Arial', 20, 'bold'), 
                              fg='white', bg='#2c3e50')
        title_label.pack(pady=20)
        
        # Main Container
        main_container = tk.Frame(self.root, bg='#f0f2f5')
        main_container.pack(fill='both', expand=True, padx=20, pady=10)
        
        # Left Frame - Controls
        left_frame = tk.Frame(main_container, bg='#ffffff', relief='ridge', bd=2)
        left_frame.pack(side='left', fill='y', padx=(0, 10))
        
        # Right Frame - Results & Notifications
        right_frame = tk.Frame(main_container, bg='#f0f2f5')
        right_frame.pack(side='right', fill='both', expand=True)
        
        # ===== LEFT FRAME CONTROLS =====
        controls_label = tk.Label(left_frame, text="CONTROLS", font=('Arial', 14, 'bold'),
                                 bg='#ffffff', fg='#2c3e50')
        controls_label.pack(pady=20)
        
        # Product Selection
        product_frame = tk.Frame(left_frame, bg='#ffffff')
        product_frame.pack(fill='x', padx=20, pady=10)
        
        tk.Label(product_frame, text="Select Product:", font=('Arial', 10, 'bold'),
                bg='#ffffff').pack(anchor='w')
        
        self.product_var = tk.StringVar(value="iPhone XS 64GB")
        products = ["iPhone XS 64GB", "Samsung Galaxy S23", "MacBook Air M2", "Custom URL"]
        for product in products:
            tk.Radiobutton(product_frame, text=product, variable=self.product_var,
                          value=product, bg='#ffffff', command=self.product_changed).pack(anchor='w')
        
        # Custom URL Entry
        self.url_frame = tk.Frame(left_frame, bg='#ffffff')
        self.url_frame.pack(fill='x', padx=20, pady=5)
        
        tk.Label(self.url_frame, text="Custom URL:", bg='#ffffff').pack(anchor='w')
        self.url_entry = tk.Entry(self.url_frame, width=30)
        self.url_entry.pack(fill='x', pady=5)
        self.url_frame.pack_forget()  # Hide initially
        
        # Notification Settings
        notify_frame = tk.Frame(left_frame, bg='#ffffff')
        notify_frame.pack(fill='x', padx=20, pady=20)
        
        tk.Label(notify_frame, text="NOTIFICATION SETTINGS", font=('Arial', 12, 'bold'),
                bg='#ffffff', fg='#2c3e50').pack(anchor='w', pady=(0, 10))
        
        # Price Alert
        alert_frame = tk.Frame(notify_frame, bg='#ffffff')
        alert_frame.pack(fill='x', pady=5)
        
        tk.Label(alert_frame, text="Price Alert (₹):", bg='#ffffff').pack(side='left')
        self.alert_entry = tk.Entry(alert_frame, width=15)
        self.alert_entry.pack(side='left', padx=5)
        
        # Notification Toggle
        self.notify_var = tk.BooleanVar(value=True)
        tk.Checkbutton(notify_frame, text="Enable Notifications", 
                      variable=self.notify_var, bg='#ffffff').pack(anchor='w', pady=5)
        
        # Scan Interval
        interval_frame = tk.Frame(notify_frame, bg='#ffffff')
        interval_frame.pack(fill='x', pady=5)
        
        tk.Label(interval_frame, text="Scan Interval (min):", bg='#ffffff').pack(side='left')
        self.interval_var = tk.StringVar(value="60")
        interval_combo = ttk.Combobox(interval_frame, textvariable=self.interval_var,
                                     values=["15", "30", "60", "120", "360"], width=10)
        interval_combo.pack(side='left', padx=5)
        
        # Action Buttons
        button_frame = tk.Frame(left_frame, bg='#ffffff')
        button_frame.pack(fill='x', padx=20, pady=30)
        
        self.scan_btn = tk.Button(button_frame, text="🔍 SCAN PRICES NOW", 
                                 font=('Arial', 12, 'bold'),
                                 bg='#27ae60', fg='white', padx=20, pady=10,
                                 command=self.start_scanning)
        self.scan_btn.pack(fill='x', pady=5)
        
        tk.Button(button_frame, text="⚙️ SAVE SETTINGS", 
                 bg='#3498db', fg='white', padx=20, pady=8,
                 command=self.save_settings).pack(fill='x', pady=5)
        
        # ===== RIGHT FRAME CONTENT =====
        # Results Tab
        notebook = ttk.Notebook(right_frame)
        notebook.pack(fill='both', expand=True)
        
        # Results Tab
        results_tab = tk.Frame(notebook, bg='#ffffff')
        notebook.add(results_tab, text="📊 Price Results")
        
        # Price Display
        self.price_frame = tk.Frame(results_tab, bg='#ffffff')
        self.price_frame.pack(fill='x', padx=20, pady=20)
        
        # Results Text Area
        self.results_text = scrolledtext.ScrolledText(results_tab, height=15, 
                                                     font=('Consolas', 10),
                                                     bg='#2c3e50', fg='white')
        self.results_text.pack(fill='both', expand=True, padx=20, pady=10)
        
        # Notifications Tab
        notify_tab = tk.Frame(notebook, bg='#ffffff')
        notebook.add(notify_tab, text="🔔 Notifications")
        
        # Notification Log
        tk.Label(notify_tab, text="Notification History:", font=('Arial', 12, 'bold'),
                bg='#ffffff').pack(anchor='w', padx=20, pady=10)
        
        self.notify_text = scrolledtext.ScrolledText(notify_tab, height=20,
                                                    font=('Arial', 9),
                                                    bg='#f8f9fa')
        self.notify_text.pack(fill='both', expand=True, padx=20, pady=10)
        
        # Status Bar
        self.status_var = tk.StringVar(value="Ready to scan prices...")
        status_bar = tk.Label(self.root, textvariable=self.status_var,
                             relief='sunken', anchor='w', bg='#34495e', fg='white')
        status_bar.pack(side='bottom', fill='x')
        
    def product_changed(self):
        if self.product_var.get() == "Custom URL":
            self.url_frame.pack(fill='x', padx=20, pady=5)
        else:
            self.url_frame.pack_forget()
    
    def log_notification(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_entry = f"[{timestamp}] {level}: {message}\n"
        
        self.notify_text.insert('end', log_entry)
        self.notify_text.see('end')
        
        # Show popup for important notifications
        if level == "ALERT" and self.notify_var.get():
            messagebox.showwarning("Price Alert!", message)
    
    def update_status(self, message):
        self.status_var.set(message)
        self.root.update_idletasks()
    
    def start_scanning(self):
        self.scan_btn.config(state='disabled', text="🔄 SCANNING...")
        thread = threading.Thread(target=self.scan_prices)
        thread.daemon = True
        thread.start()
    
    def scan_prices(self):
        try:
            self.update_status("Setting up browser...")
            driver = self.setup_driver()
            
            # Clear previous results
            self.results_text.delete(1.0, tk.END)
            
            # Scan prices based on selection
            product = self.product_var.get()
            if product == "iPhone XS 64GB":
                self.scan_iphone_xs(driver)
            elif product == "Custom URL":
                self.scan_custom_url(driver)
            # Add other products here...
            
            driver.quit()
            self.update_status("Scan completed successfully!")
            self.log_notification("Price scan completed successfully")
            
        except Exception as e:
            error_msg = f"Error during scanning: {str(e)}"
            self.update_status(error_msg)
            self.log_notification(error_msg, "ERROR")
            messagebox.showerror("Scan Error", error_msg)
        
        finally:
            self.scan_btn.config(state='normal', text="🔍 SCAN PRICES NOW")
    
    def setup_driver(self):
        """Automatically setup Chrome driver"""
        chrome_options = Options()
        chrome_options.add_experimental_option('useAutomationExtension', False)
        chrome_options.add_argument('--ignore-certificate-errors')
        chrome_options.add_argument('--start-maximized')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_argument('--headless')  # Run in background
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        return driver
    
    def scan_iphone_xs(self, driver):
        """Scan prices for iPhone XS from all websites"""
        websites = {
            "Flipkart": "https://www.flipkart.com/apple-iphone-xs-space-grey-64-gb/p/itmf944ees7rprte",
            "Amazon": "https://www.amazon.in/Apple-iPhone-Xs-Max-64GB/dp/B07J3CJM4N",
            "Croma": "https://www.croma.com/apple-iphone-xs-space-grey-64-gb-4-gb-ram-/p/214062"
        }
        
        results = []
        
        for site, url in websites.items():
            try:
                self.update_status(f"Scanning {site}...")
                price = self.get_website_price(driver, url, site)
                results.append((site, price))
                
                # Check price alert
                self.check_price_alert(site, price)
                
                time.sleep(2)  # Be polite between requests
                
            except Exception as e:
                results.append((site, f"Error: {str(e)}"))
                self.log_notification(f"Failed to scan {site}: {str(e)}", "ERROR")
        
        # Display results
        self.display_results(results)
    
    def get_website_price(self, driver, url, website):
        """Get price from specific website"""
        driver.get(url)
        wait = WebDriverWait(driver, 15)
        
        selectors = {
            "Flipkart": [
                "//div[contains(@class, 'Nx9bqj')]",
                "//div[contains(@class, '_16Jk6d')]",
                "//div[contains(@class, '_30jeq3')]"
            ],
            "Amazon": [
                "//span[contains(@class, 'a-price-whole')]",
                "//span[contains(@class, 'a-offscreen')]",
                "//span[contains(@class, 'apexPriceToPay')]"
            ],
            "Croma": [
                "//span[contains(@class, 'amount')]",
                "//div[contains(@class, 'new-price')]",
                "//span[contains(@class, 'price')]"
            ]
        }
        
        for selector in selectors.get(website, []):
            try:
                price_element = wait.until(EC.presence_of_element_located((By.XPATH, selector)))
                price = price_element.text.strip()
                if price and '₹' in price or any(char.isdigit() for char in price):
                    return price
            except:
                continue
        
        return "Price not found"
    
    def check_price_alert(self, website, price_str):
        """Check if price meets alert criteria"""
        if not self.alert_entry.get():
            return
        
        try:
            # Extract numeric price
            price_clean = ''.join(c for c in price_str if c.isdigit() or c == '.')
            if price_clean:
                current_price = float(price_clean)
                target_price = float(self.alert_entry.get())
                
                if current_price <= target_price:
                    alert_msg = f"🎯 ALERT! {website} price ₹{current_price} is below target ₹{target_price}"
                    self.log_notification(alert_msg, "ALERT")
                    
        except ValueError:
            pass
    
    def scan_custom_url(self, driver):
        """Scan price from custom URL"""
        custom_url = self.url_entry.get().strip()
        if not custom_url:
            messagebox.showwarning("Input Error", "Please enter a custom URL")
            return
        
        try:
            self.update_status("Scanning custom URL...")
            price = self.get_custom_price(driver, custom_url)
            
            results = [("Custom Website", price)]
            self.display_results(results)
            
            self.check_price_alert("Custom Website", price)
            
        except Exception as e:
            error_msg = f"Error scanning custom URL: {str(e)}"
            self.log_notification(error_msg, "ERROR")
    
    def get_custom_price(self, driver, url):
        """Generic price extraction for custom URLs"""
        driver.get(url)
        wait = WebDriverWait(driver, 15)
        
        # Try common price selectors
        common_selectors = [
            "//span[contains(@class, 'price')]",
            "//div[contains(@class, 'price')]",
            "//span[contains(@class, 'amount')]",
            "//meta[contains(@property, 'price')]",
            "//*[contains(text(), '₹')]",
            "//*[contains(text(), 'Rs.')]",
            "//*[contains(text(), 'INR')]"
        ]
        
        for selector in common_selectors:
            try:
                price_element = wait.until(EC.presence_of_element_located((By.XPATH, selector)))
                price = price_element.get_attribute('content') or price_element.text
                if price and any(char.isdigit() for char in price):
                    return price.strip()
            except:
                continue
        
        return "Price not found"
    
    def display_results(self, results):
        """Display results in the text area"""
        self.results_text.delete(1.0, tk.END)
        
        # Add header
        header = "🛍️  PRICE COMPARISON RESULTS\n"
        header += "=" * 50 + "\n\n"
        self.results_text.insert(tk.END, header)
        
        # Add results
        for website, price in results:
            result_line = f"🏪 {website:.<30} {price}\n"
            self.results_text.insert(tk.END, result_line)
        
        # Add timestamp
        timestamp = f"\n🕒 Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        self.results_text.insert(tk.END, timestamp)
    
    def save_settings(self):
        """Save notification settings"""
        settings = {
            'notifications': self.notify_var.get(),
            'target_price': self.alert_entry.get(),
            'interval': self.interval_var.get(),
            'product': self.product_var.get(),
            'custom_url': self.url_entry.get()
        }
        
        try:
            with open('price_tracker_settings.json', 'w') as f:
                json.dump(settings, f)
            self.log_notification("Settings saved successfully")
            messagebox.showinfo("Success", "Settings saved successfully!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save settings: {str(e)}")
    
    def load_settings(self):
        """Load saved settings"""
        try:
            if os.path.exists('price_tracker_settings.json'):
                with open('price_tracker_settings.json', 'r') as f:
                    settings = json.load(f)
                
                self.notify_var.set(settings.get('notifications', True))
                self.alert_entry.insert(0, settings.get('target_price', ''))
                self.interval_var.set(settings.get('interval', '60'))
                self.product_var.set(settings.get('product', 'iPhone XS 64GB'))
                self.url_entry.insert(0, settings.get('custom_url', ''))
                
                self.product_changed()  # Update UI
                self.log_notification("Settings loaded successfully")
                
        except Exception as e:
            self.log_notification(f"Error loading settings: {str(e)}", "ERROR")

def main():
    # Check dependencies
    try:
        import selenium
        import webdriver_manager
    except ImportError:
        print("Please install required packages:")
        print("pip install selenium webdriver-manager")
        return
    
    root = tk.Tk()
    app = PriceComparisonApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()