# Add project specific ProGuard rules here.
-keep class com.gujarat.census.** { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
