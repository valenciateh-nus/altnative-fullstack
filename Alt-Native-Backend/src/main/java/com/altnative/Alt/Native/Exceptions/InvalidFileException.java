package com.altnative.Alt.Native.Exceptions;

public class InvalidFileException extends Exception{
    public InvalidFileException(String message) {
        super("Uploaded file was invalid: " + message);
    }
}
