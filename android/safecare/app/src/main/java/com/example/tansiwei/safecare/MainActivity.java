package com.example.tansiwei.safecare;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import android.app.ProgressDialog;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;


public class MainActivity extends AppCompatActivity {

    private String url = "http://songciclient.vps.lppy.site:6060";
    private WebView webView;
    private ProgressDialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initWebView();
//        initBluetooth();
    }
    private BluetoothAdapter mBluetoothAdapter;
    private void initBluetooth(){
        // Initializes Bluetooth adapter.
        final BluetoothManager bluetoothManager =
                (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();

        // Ensures Bluetooth is available on the device and it is enabled. If not,
        // displays a dialog requesting user permission to enable Bluetooth.
        if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
//            Log.e(TAG, "initBluetooth: 蓝牙没有成功");
            return;
//            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
//            startActivityForResult(enableBtIntent, );
        }

        
    }
    private void initWebView() {
        webView = (WebView) findViewById(R.id.webview);
        webView.loadUrl(url);

        //覆盖WebView默认通过第三方或者是系统浏览器打开网页的行为，使网页可以再WebView中打开
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
            //返回值是true的时候控制网页在WebView中去打开，如果为false调用系统浏览器或者第三方浏览器打开
            view.loadUrl(url);
            return true;
        }//WebViewClient帮助WebView去处理一些页面控制和请求通知
    });

        //启用支持javaScript
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);

        //支持定位
        settings.setDatabaseEnabled(true);
        String dir = this.getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        //启用地理定位 
        settings.setGeolocationEnabled(true);
        //设置定位的数据库路径 
        settings.setGeolocationDatabasePath(dir);
        settings.setDomStorageEnabled(true);

        //WebView加载页面优先使用缓存加载
//        settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                //newProgress 1-100之间的整数
                if (newProgress == 100) {
                    //网页加载完毕,关闭ProgressDialog
                    closeDialo();
                } else {
                    //网页正在加载，打开ProgressDialog
                    openDialog(newProgress);
                }
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
                super.onGeolocationPermissionsShowPrompt(origin, callback);
            }

            private void closeDialo() {
                if (dialog != null && dialog.isShowing()) {
                    dialog.dismiss();
                    dialog = null;
                }
            }

            private void openDialog(int newProgress) {
                if (dialog == null) {
                    dialog = new ProgressDialog(MainActivity.this);
                    dialog.setTitle("加载中...");
                    dialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
                    dialog.setProgress(newProgress);
                    dialog.show();
                } else {
                    dialog.setProgress(newProgress);
                }
            }
        });

    }

    @Override //改写物理按键——返回的逻辑
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if(keyCode == KeyEvent.KEYCODE_BACK){
            if(webView.canGoBack()){
                webView.goBack();   //返回上一页面
                return true;
            }else {
                System.exit(0);
            }
        }
        return super.onKeyDown(keyCode,event);
    }

}
