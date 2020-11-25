(function (w) {
    /*
    * 读取或设置元素动画值
    * @params node 元素
    * @params name 动画名
    * @params value 动画值
    * @return 元素动画值
    */
    w.transformCss = function (node, name, value) {
        if (!node.transform) {
            node.transform = {};
        }
        if (arguments.length > 2) {
            node.transform[name] = value;
            var result = '';
            for (var item in node.transform) {
                switch (item) {
                    case 'rotate':
                    case 'skew':
                    case 'skewX':
                    case 'skewY':
                        result += ' ' + item + '('+ node.transform[item] +'deg)';
                        break;
                    case 'scale':
                    case 'scaleX':
                    case 'scaleY':
                        result += ' ' + item + '('+ node.transform[item] +')';
                        break;
                    case 'translate':
                    case 'translateX':
                    case 'translateY':
                        result += ' ' + item + '('+ node.transform[item] +'px)';
                        break;
                }
            }
            node.style.transform = result;
        } else {
            if (typeof node.transform[name] == 'undefined') {
                // 这三个值比较特殊，因为它们的默认值是1
                if (name == 'scale' || name == 'scaleX' || name == 'scaleY') {
                    value = 1
                } else {
                    value = 0
                }
            } else {
                value = node.transform[name]
            }
            return value
        }
    }
})(window)