package com.altnative.Alt.Native.Exceptions;

public class InvalidAddOnException extends Exception {
    public InvalidAddOnException(String msg) {
        super("Addon was invalid: " + msg);
    }
}

