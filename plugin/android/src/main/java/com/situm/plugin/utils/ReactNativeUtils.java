package com.situm.plugin.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

public class ReactNativeUtils {
    public static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String) {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    public static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
        WritableArray array = new WritableNativeArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof JSONObject) {
                array.pushMap(convertJsonToMap((JSONObject) value));
            } else if (value instanceof JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else if (value instanceof Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String) {
                array.pushString((String) value);
            } else {
                array.pushString(value.toString());
            }
        }
        return array;
    }

    public static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    // Check if the number is an integer or a double
                    double tmpValue = readableMap.getDouble(key);
                    if (tmpValue == Math.rint(tmpValue)) {
                        object.put(key, readableMap.getInt(key));
                    } else {
                        object.put(key, tmpValue);
                    }
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMapToJson(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArrayToJson(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }

    public static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray array = new JSONArray();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    array.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    array.put(readableArray.getDouble(i));
                    break;
                case String:
                    array.put(readableArray.getString(i));
                    break;
                case Map:
                    array.put(convertMapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    array.put(convertArrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return array;
    }

    public static Map<String, Object> convertReadableMapToMap(ReadableMap readableMap) {
        Map<String, Object> map = new HashMap<>();

        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();

            switch (readableMap.getType(key)) {
                case Null:
                    map.put(key, null);
                    break;
                case Boolean:
                    map.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    // Check if the number is an integer or a double
                    double tmpValue = readableMap.getDouble(key);
                    if (tmpValue == Math.rint(tmpValue)) {
                        map.put(key, readableMap.getInt(key));
                    } else {
                        map.put(key, tmpValue);
                    }
                    break;
                case String:
                    map.put(key, readableMap.getString(key));
                    break;
                case Map:
                    map.put(key, convertReadableMapToMap(readableMap.getMap(key)));
                    break;
                case Array:
                    map.put(key, convertReadableArrayToList(readableMap.getArray(key)));
                    break;
            }
        }

        return map;
    }

    private static List<Object> convertReadableArrayToList(ReadableArray readableArray) {
        List<Object> list = new ArrayList<>();

        for (int i = 0; i < readableArray.size(); i++) {

            switch (readableArray.getType(i)) {
                case Null:
                    list.add(null);
                    break;
                case Boolean:
                    list.add(readableArray.getBoolean(i));
                    break;
                case Number:
                    // Check if the number is an integer or a double
                    double tmpValue = readableArray.getDouble(i);
                    if (tmpValue == Math.rint(tmpValue)) {
                        list.add(readableArray.getInt(i));
                    } else {
                        list.add(tmpValue);
                    }
                    break;
                case String:
                    list.add(readableArray.getString(i));
                    break;
                case Map:
                    list.add(convertReadableMapToMap(readableArray.getMap(i)));
                    break;
                case Array:
                    list.add(convertReadableArrayToList(readableArray.getArray(i)));
                    break;
            }
        }

        return list;
    }

    public static ReadableMap convertMapToReadableMap(Map<String, Object> map) {
        WritableMap writableMap = Arguments.createMap();

        for (Map.Entry<String, Object> entry : map.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            if (value == null) {
                writableMap.putNull(key);
            } else if (value instanceof String) {
                writableMap.putString(key, (String) value);
            } else if (value instanceof Integer) {
                writableMap.putInt(key, (Integer) value);
            } else if (value instanceof Double) {
                writableMap.putDouble(key, (Double) value);
            } else if (value instanceof Float) {
                writableMap.putDouble(key, ((Float) value).doubleValue());
            } else if (value instanceof Long) {
                Long longValue = (Long) value;
                if (longValue <= Integer.MAX_VALUE && longValue >= Integer.MIN_VALUE) {
                    writableMap.putInt(key, longValue.intValue());
                } else {
                    writableMap.putDouble(key, longValue.doubleValue());
                }
            } else if (value instanceof Boolean) {
                writableMap.putBoolean(key, (Boolean) value);
            } else if (value instanceof Map) {
                writableMap.putMap(key, convertMapToReadableMap((Map<String, Object>) value));
            } else if (value instanceof List) {
                writableMap.putArray(key, convertListToWritableArray((List<Object>) value));
            } else {
                // Handle other types if necessary
                throw new IllegalArgumentException("Unsupported value type for key: " + key);
            }
        }

        return writableMap;
    }

    private static WritableArray convertListToWritableArray(List<Object> list) {
        WritableArray writableArray = Arguments.createArray();

        for (Object value : list) {
            if (value == null) {
                writableArray.pushNull();
            } else if (value instanceof String) {
                writableArray.pushString((String) value);
            } else if (value instanceof Integer) {
                writableArray.pushInt((Integer) value);
            } else if (value instanceof Double) {
                writableArray.pushDouble((Double) value);
            } else if (value instanceof Float) {
                writableArray.pushDouble(((Float) value).doubleValue());
            } else if (value instanceof Long) {
                Long longValue = (Long) value;
                if (longValue <= Integer.MAX_VALUE && longValue >= Integer.MIN_VALUE) {
                    writableArray.pushInt(longValue.intValue());
                } else {
                    writableArray.pushDouble(longValue.doubleValue());
                }
            } else if (value instanceof Boolean) {
                writableArray.pushBoolean((Boolean) value);
            } else if (value instanceof Map) {
                writableArray.pushMap(convertMapToReadableMap((Map<String, Object>) value));
            } else if (value instanceof List) {
                writableArray.pushArray(convertListToWritableArray((List<Object>) value));
            } else {
                // Handle other types if necessary
                throw new IllegalArgumentException("Unsupported value type in list");
            }
        }

        return writableArray;
    }

}
