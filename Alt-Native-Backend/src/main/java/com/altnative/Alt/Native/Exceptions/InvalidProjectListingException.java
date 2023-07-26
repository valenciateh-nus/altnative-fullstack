package com.altnative.Alt.Native.Exceptions;

public class InvalidProjectListingException extends Exception {
    public InvalidProjectListingException(String message) {
        super("Project Listing information is invalid: " + message);
    }
}
