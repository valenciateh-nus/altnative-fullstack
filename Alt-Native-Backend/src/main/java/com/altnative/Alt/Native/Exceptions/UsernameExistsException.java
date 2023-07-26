package com.altnative.Alt.Native.Exceptions;

public class UsernameExistsException extends Exception{
    public UsernameExistsException(String username) {
        super("Username: " + username +  " already exists.");
    }
}
