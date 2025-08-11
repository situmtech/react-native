package com.situm.plugin.webview;

import android.util.Log;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import es.situm.sdk.error.Error;
import es.situm.sdk.wayfinding.MapView;
import es.situm.sdk.wayfinding.MapViewConfiguration;
import es.situm.sdk.wayfinding.MapViewController;

public class WebViewManager extends SimpleViewManager<FrameLayout> {

  public static final String REACT_CLASS = "WebView";
  // TODO: estou metendo un estático, esto si usamos MapViewManager xa non faría falta.
  private static FrameLayout view;

  @NonNull
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @NonNull
  @Override
  public FrameLayout createViewInstance(ThemedReactContext context) {
    if (view == null) {
      view = new FrameLayout(context);
      MapView mapView = new MapView(context, null);
      view.addView(mapView);
      // TODO: pasar a config dalgún xeito e facer load().
      MapViewConfiguration config = new MapViewConfiguration.Builder()
        .setBuildingIdentifier("7033")
        .build();
      mapView.load(config, new MapView.MapViewCallback() {
        @Override
        public void onLoad(@NonNull MapViewController mapViewController) {
          Log.d("ATAG", "MapView loaded!");
        }

        @Override
        public void onError(@NonNull Error error) {
          Log.e("ATAG", "MapView error: " + error.getMessage());
        }
      });
    }
    return view;
  }
}
