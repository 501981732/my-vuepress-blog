## vue版 图片转base64

> 上传图片转base64 
1. eventz:
    - @size-error 图片过大  
    - @type-error 类型错误  
    - @file-info 图片base64的信息
2. props: 
    - accept 图片类型 
    - previewImage支持图片预览  
    - maxSize 图片大小（M）
    - multiple多文件上传 --todo 

### Usage

 ```js
<template>

<image-to-base64 
    :maxSize ='100/1024'
    :previewImage='previewImage' 
    @file-info='reciveFileInfo' 
    @size-error='sizeError' 
    @type-error='typeError' 
    class='upload-btn'>
</image-to-base64>

</template>


<script>

  import imageToBase64 from 'imageToBase64';
  import upload from '..'
  export default {

    components: { imageToBase64 },
    data(){
        return {
            previewImage:true,//是否预览图片
        }
        },
    methods: {
      getFiles(files){
        console.log(files);
      },
        reciveFileInfo(v) {
            // console.log(v)
            this.fileInfo = v
            v &&  this.uploadImage() //上传
        },
        sizeError(v) {
            v && alert('图片过大')
        },
        typeError(v) {
            v && alert('类型错误')
        },
        uploadImage() {
            if (this.fileInfo) {
                upload(this.fileInfo.base64).then( url => {
                    console.log(url)
                })
                .catch( err => {
                    console.log(err)
                })
            }
        },
    }
  };

</script>
 ```
### [git地址](https://github.com/501981732/imageToBase64)
### [vue-image-base64地址](https://www.npmjs.com/package/vue-image-base64)