$(function(){
	var num = "";
	var linum = $('.listpage li').length;
	$('.listpage li').click(function(){
		$(this).addClass('cli').siblings().removeClass('cli');
		num =$(this).index();

	});
	$('.onepage').click(function(){
		$('.listpage li').eq(0).addClass('cli').siblings().removeClass('cli');
		num = 0;
		if(linum>5){
			for(var i=5; i<linum; i++){
				$('.listpage li').eq(i).hide();
			}
			for(var i=0; i<5; i++){
				$('.listpage li').eq(i).show();
			}
		}
	});
	$('.lastpage').click(function(){
		num = linum-1;
		
		$('.listpage li').eq(num).show();
		$('.listpage li').eq(num).addClass('cli').siblings().removeClass('cli');
		if(linum>5){
			for(var i=0; i<num-4;i++){
				$('.listpage li').eq(i).hide();
			};
			for(var i=num-4; i<num; i++){
				$('.listpage li').eq(i).show();
			}
		}
		console.log(num);
	});
	
	$('.prvepage').click(function(){
		if(num!=0){
			num--;
		}
		$('.listpage li').eq(num).show();
		$('.listpage li').eq(num+5).hide();
		$('.listpage li').eq(num).addClass('cli').siblings().removeClass('cli');
	});
	$('.nextpage').click(function(){
		if(num!=linum-1){
			num++;
		}
		$('.listpage li').eq(num).show();
		if(num>4){
			$('.listpage li').eq(num-5).hide();
		}
		$('.listpage li').eq(num).addClass('cli').siblings().removeClass('cli');
	});
	
$('.list-dede-bg').click(function(){
	$('.list-dede').hide();
	$('.map').hide();
})
	
	
$('.mapclose').click(function(){
	$('.map').hide();
});
$('.listclose').click(function(){
	$('.list-dede').hide();
	$('.map').hide();
});
$('.mapbtn').click(function(){
	$('.map').show();
	map();
})

function map(){
	
				var map = new BMap.Map("allmap");
				var point = new BMap.Point(116.331398,39.897445);
				map.centerAndZoom(point,12);
				// 创建地址解析器实例
				var myGeo = new BMap.Geocoder();
				// 将地址解析结果显示在地图上,并调整地图视野
				myGeo.getPoint("杭州市江干区笕丁路168号", function(point){
				if (point) {
				map.centerAndZoom(point, 16);
				map.addOverlay(new BMap.Marker(point));
				}else{
				alert("您选择地址没有解析到结果!");
				}
				}, "北京市");
};

$('.shenh').click(function(){
	$('.list-dede').show();
});
if(linum>5){
	for(var i = 5; i<linum; i++){
		$('.listpage li').eq(i).hide();
	}
}

$(document).click(function(){
	$('.openimg').hide();
});
$('.list-de-right img').click(function(event){
	event.stopPropagation();
	$('.openimg').show();
	$('.openimg img').attr('src',$(this).attr('src'));
});
$('.refuse-close').click(function(){
		$('.refuse-tc').hide();
});
$('.refuse').click(function(){
	$('.refuse-tc').show();
});

})
