package com.altnative.Alt.Native.Exceptions;

public class InvalidTransactionException extends Exception {
    public InvalidTransactionException(String msg) {
        super("Transaction was invalid: " + msg);
    }
}
