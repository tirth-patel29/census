package com.gujarat.census

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.KeyEvent
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.gujarat.census.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var webView: WebView

    // ─── CONFIGURE THIS URL ─────────────────────────────────────────────────
    // For development (PC and phone on same WiFi):
    //   Replace with your PC's local IP: "http://192.168.x.x:3000"
    // For production (Vercel):
    //   Replace with your Vercel URL: "https://your-app.vercel.app"
    private val APP_URL = "https://your-app.vercel.app"
    // ────────────────────────────────────────────────────────────────────────

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        webView = binding.webView

        setupWebView()

        // Load app
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            webView.loadUrl(APP_URL)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings: WebSettings = webView.settings

        // Core features
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true          // For localStorage (offline queue)
        settings.databaseEnabled = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        // Performance
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH)
        settings.loadsImagesAutomatically = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

        // PWA / Modern Web
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.userAgentString = settings.userAgentString + " CensusAndroidApp/1.0"

        // Cookie support (for Supabase auth)
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)

        // JavaScript bridge — Android <-> Web
        webView.addJavascriptInterface(AndroidBridge(), "AndroidBridge")

        // WebViewClient — stay in-app, handle navigation
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url.toString()
                return when {
                    url.startsWith(APP_URL) -> false // Stay in WebView
                    url.startsWith("http") -> {
                        // Open external URLs in browser
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        true
                    }
                    else -> false
                }
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                // Inject CSS for better mobile experience
                view.evaluateJavascript("""
                    (function() {
                        // Hide scrollbars on mobile for cleaner look
                        var style = document.createElement('style');
                        style.innerHTML = '::-webkit-scrollbar { display: none; }';
                        document.head.appendChild(style);
                        // Signal that we're running in Android WebView
                        window.isAndroidApp = true;
                    })();
                """.trimIndent(), null)
            }

            override fun onReceivedError(
                view: WebView,
                errorCode: Int,
                description: String,
                failingUrl: String
            ) {
                // Show offline page if network fails
                view.loadData(getOfflinePage(), "text/html", "UTF-8")
            }
        }

        // Chrome client — for console logs, alerts, file chooser
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(
                message: android.webkit.ConsoleMessage
            ): Boolean {
                // Forward JS console to Android Logcat
                android.util.Log.d("CensusWebView", message.message())
                return true
            }
        }
    }

    inner class AndroidBridge {
        @JavascriptInterface
        fun showToast(message: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, message, Toast.LENGTH_SHORT).show()
            }
        }

        @JavascriptInterface
        fun getAppVersion(): String = "1.0"

        @JavascriptInterface
        fun isAndroidApp(): Boolean = true
    }

    private fun getOfflinePage(): String = """
        <!DOCTYPE html>
        <html lang="gu">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {
                    font-family: sans-serif;
                    background: #000080;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    text-align: center;
                    padding: 20px;
                }
                .card {
                    background: rgba(255,255,255,0.1);
                    border-radius: 16px;
                    padding: 32px;
                    max-width: 300px;
                }
                .icon { font-size: 64px; margin-bottom: 16px; }
                h1 { font-size: 22px; margin: 0 0 8px; }
                p { font-size: 14px; opacity: 0.8; margin: 0 0 20px; }
                button {
                    background: #FF9933;
                    border: none;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">📡</div>
                <h1>ઇન્ટરનેટ નથી</h1>
                <p>ઇન્ટરનેટ કનેક્શન ચકાસો અને ફરી પ્રયાસ કરો.</p>
                <button onclick="location.reload()">ફરી પ્રયાસ કરો</button>
            </div>
        </body>
        </html>
    """.trimIndent()

    // Handle hardware back button
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    // Save WebView state across orientation changes
    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
    }
}
