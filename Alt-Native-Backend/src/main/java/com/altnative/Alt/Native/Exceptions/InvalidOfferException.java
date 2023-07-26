package com.altnative.Alt.Native.Exceptions;

public class InvalidOfferException extends Exception {
    public InvalidOfferException(String message) {
        super("Offer information is invalid: " + message);
    }
}
