package com.altnative.Alt.Native.Exceptions;

public class CreditCardNotFoundException extends Exception {
    public CreditCardNotFoundException(String message) {
        super("Credit card cannot be found" + message);
    }
}
