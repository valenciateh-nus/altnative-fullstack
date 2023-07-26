package com.altnative.Alt.Native.Exceptions;

public class InvalidProjectRequestException extends Exception {
    public InvalidProjectRequestException(String message) {
        super("Project Request information is invalid: " + message);
    }
}
