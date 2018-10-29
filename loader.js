(function (root, factory){
    if(typeof define === 'function' && define.amd){
        define(factory);
    } else if(typeof exports === 'object'){
        module.exports = factory();
    } else {
        root.resLoader = factory(root);
    }

})(this, function(){
    function resLoader(config){
        this.option = {
            resourceType : 'image',//资源类型
            baseUrl : './',//基准url
            resources : [],//资源路径数组
            onStart : null,//加载开始回调函数，传参total
            onProgress : null,//正在加载回调函数，传参currentIndex， total
            onComplete : null //加载完毕回调函数，传参total
        }
        if(config){
            for(i in config){
                this.option[i] = config[i];
            }
        }else{
            alert('参数错误！');
            return;
        }
        this.status = 0;//加载器的状态，0：未启动，1：正在加载，2：加载完成
        this.total = this.option.resources.length || 0;//资源总数
        this.currentIndex = 0;//正在加载的资源索引
    };
    var isFunc = function(f){
        return typeof f === 'function';
    }

    resLoader.prototype.start = function(){
        this.status = 1;
        var _this = this;
        var baseUrl = this.option.baseUrl;
        for(var i=0;i<this.option.resources.length;i++){
            var r = this.option.resources[i],
                url='';
            if(r.indexOf('http://')===0 || r.indexOf('https://')===0){
                url = r;
            }else{
                url = baseUrl + r;
            }

            var image = new Image();
            image.onload = function(){_this.loaded();};
            image.onerror = function(){_this.loaded();};
            image.src = url;
        }
        if(isFunc(this.option.onStart)){
            this.option.onStart(this.total);
        }
    };
    resLoader.prototype.loaded = function(){
        if(isFunc(this.option.onProgress)){
            this.option.onProgress(++this.currentIndex,this.total);
        }
        //加载完毕
        if(this.currentIndex === this.total){
            if(isFunc(this.option.onComplete)){
                this.option.onComplete(this.total);
            }
        }
    }

    return resLoader;
})