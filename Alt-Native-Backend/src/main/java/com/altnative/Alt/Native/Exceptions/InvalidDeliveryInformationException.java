package com.altnative.Alt.Native.Exceptions;

public class InvalidDeliveryInformationException extends Exception {
    public InvalidDeliveryInformationException(String message) {
        super("Delivery information is invalid: " + message);
    }
}
