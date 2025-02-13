/*highcharts控件画图*/
  $(function () {
    $('#container').highcharts({
        /*标题*/
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        /*小标题*/
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        /*x轴数据*/
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        /*y轴数据*/
        yAxis: {
        	/*轴标题的显示文本。*/
            title: {
                text: 'Temperature (°C)'
            },
            /*绘图区域上标记轴*/
            plotLines: [{
                value: 0, /*区域划分线代表的值*/
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C' /*一串字符被后置在每个Y轴的值之后。*/
        },
        /*图例*/
        legend: {
            layout: 'vertical', /*图例数据项的布局。布局类型：水平或垂直。默认是：水平*/
            align: 'right', 
            verticalAlign: 'middle', /*右中*/
            borderWidth: 0     /*图例边框*/
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });
});