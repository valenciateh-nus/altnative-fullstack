package com.altnative.Alt.Native.Exceptions;

public class InvalidOrderException extends Exception {
    public InvalidOrderException(String message) {
        super("Order information is invalid: " + message);
    }
}
