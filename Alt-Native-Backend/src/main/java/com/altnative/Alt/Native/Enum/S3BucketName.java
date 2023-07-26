package com.altnative.Alt.Native.Enum;

public enum S3BucketName {

    ALTNATIVE_MEDIA("altnative-media-upload");

    private final String bucketName;

    S3BucketName(String bucketName) {
        this.bucketName = bucketName;
    }

    public String getBucketName() {
        return bucketName;
    }
}
