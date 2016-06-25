tmmApp.factory('bottomBarService',function(){
    
    return {
        ele : {},
        style : 'position: fixed;bottom: 0;top: 0;left: 0;right: 0;z-index:101;background-color: rgba(0,0,0,0.5);',
        showBar : function(parent, tpl){
            var height = document.documentElement.clientHeight;
            this.ele = document.createElement('div');
            this.ele.style.cssText = this.style;

            var moveDiv = document.createElement('div');
            moveDiv.innerHTML = tpl;
            moveDiv.style.cssText = 'margin-top: '+height+'px;transition: margin-top 0.2s';
            this.ele.appendChild(moveDiv);
            parent.appendChild(this.ele);

            moveDiv.style.marginTop = height-moveDiv.offsetHeight +'px';

        },
        removeBar : function() {

            this.ele.parentNode.removeChild(this.ele);
        }
    }
    
});