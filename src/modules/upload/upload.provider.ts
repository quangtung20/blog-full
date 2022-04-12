import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { unlink } from 'fs';
export const CloudinaryProvider = {
    provide: 'Cloudinary',
    useFactory: (): any => {
        return v2.config({
            cloud_name: `${process.env.CLOUDINARY_NAME}`,
            api_key: `${process.env.CLOUDINARY_API_KEY}`,
            api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
        })
    }
}



export const removeTmp = (path) => {
    unlink(path, err => {
        if (err) throw err;
    })
}