package com.altnative.Alt.Native.Exceptions;

public class InvalidCreditCardException extends Exception {
    public InvalidCreditCardException(String message) {
        super("Credit card information is invalid: " + message);
    }
}
