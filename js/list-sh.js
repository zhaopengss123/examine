$(function(){
var contentpost = 	'js/content.json'; //内容接口
var listpost = 	'js/list.json';		//列表接口
var uploadpost = "";				//审核通过提交接口
var num = 0;
function listpagebtn(linum){	
	
	var linum =linum ;

	$('.listpage li').click(function(){
		$(this).addClass('cli').siblings().removeClass('cli');
		num =$(this).index();
		var numm= num+1;
		getlist(numm);
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
		var numm= num+1;
		getlist(numm);
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
		var numm= num+1;
		getlist(numm);
	});
	
	$('.prvepage').click(function(){
		if(num!=0){
			num--;
		}
		$('.listpage li').eq(num).show();
		$('.listpage li').eq(num+5).hide();
		$('.listpage li').eq(num).addClass('cli').siblings().removeClass('cli');
		var numm= num+1;
		getlist(numm);
	});
	$('.nextpage').click(function(){
		
		if(num!=linum-1){
			console.log( num, linum );
			num++;
		}
		$('.listpage li').eq(num).show();
		if(num>4){
			$('.listpage li').eq(num-5).hide();
		}
		$('.listpage li').eq(num).addClass('cli').siblings().removeClass('cli');
		var numm= num+1;
		getlist(numm);
			
	});


};




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

})

function map(dizhi){
	$('.map').css({
		width:'400px',
		height:'400px'
	})
				var map = new BMap.Map("allmap");
				var point = new BMap.Point(116.331398,39.897445);
				map.centerAndZoom(point,12);
				// 创建地址解析器实例
				var myGeo = new BMap.Geocoder();
				
				myGeo.getPoint(dizhi, function(point){
				if (point) {
				map.centerAndZoom(point, 16);
				map.addOverlay(new BMap.Marker(point));
				}else{
				alert("您选择地址没有解析到结果!");
				}
				}, "北京市");
};




$(document).click(function(){
	$('.openimg').hide();
});

$('.refuse-close').click(function(){
		$('.refuse-tc').hide();
});
$('.refuse').click(function(){
	$('.refuse-tc').show();
});

function getlist(page){
	$.ajax({
	type:'POST',
	url:listpost,//获取列表
	timeout:10000,
	data:{
		pageNo:page,
		pageSize:10,
	},success:function(data){
			$('.listcontent').html("");
		$.each(data.list,function(index){
			$('.listcontent').append('<div class="listlist"><ul><li>'+data.list[index].shopName+'</li><li>'+data.list[index].shopCode+'</li><li class="shenh shenhe">立即审核</li><li class="listid">'+ data.list[index].id +'</li></ul></div>');	
		});	
		
		$('.shenh').click(function(){
			$('.list-dede').show();		
		});
	},complete : function(XMLHttpRequest,status){ 
　　　　if(status=='timeout'){
 　　　　　 ajaxTimeoutTest.abort();
　　　　　  alert("超时");
　　　　		}
　　		}
		})
}

$.ajax({
	type:'POST',
	url:listpost,//获取列表
	timeout:10000,
	data:{
		pageNo:1,
		pageSize:10,
	},success:function(data){
		$.each(data.list,function(index){
			$('.listcontent').append('<div class="listlist"><ul><li>'+data.list[index].shopName+'</li><li>'+data.list[index].shopCode+'</li><li class="shenh shenhe">立即审核</li><li class="listid">'+ data.list[index].id +'</li></ul></div>');	
		});
		var listpagenum = Math.ceil(data.total/10);
		
		for(var i = 0; i<listpagenum; i++){
			$('.listpage').append('<li>'+(i+1)+'</li>');
		}
			$('.listpage li').eq(0).addClass('cli');
			var linum =$('.listpage li').length;
			listpagebtn(linum);
				if(linum>5){
				for(var i = 5; i<linum; i++){
					$('.listpage li').eq(i).hide();
				}
				}
			
			
		$('.shenh').click(function(){
				$('.list-dede').show();
			var listid= $(this).siblings('.listid').html();

			postlistmain(listid);
			
		});
	},complete : function(XMLHttpRequest,status){ 
　　　　if(status=='timeout'){
 　　　　　 ajaxTimeoutTest.abort();
　　　　　  alert("超时");
　　　　}
　　}
})
function postlistmain(id){

	$.ajax({
		type:'POST',
		url:contentpost,
		data:{
			id:id
		},success:function(data){
			var sucid = data.id;
			$('.mdname').html(data.shopName);
			$('.mdnames').html('门店名称: '+ data.shopName);
			$('.address').html(data.shopAddress);
			$('.dzdpname').html(data.publicCommentName);
			
			$('.mtname').html(data.meituanName);
			$('.shengshiqu').html(data.province + data.city +data.area );
			$('.zzimg img').attr('src',data.bussinessLicense);
			$('.bhss').html(data.facilitie);
			$('.yysj').html(data.businessTime);
			$('.wsaq').html(data.healthSafe);
			$('.wxts').html(data.warmPrompt);
			$('.jtxx').html(data.trafficInformation);
			$('.tcc').html(data.parkingInformation);
			map(data.shopAddress);
			$('.fmimg img').attr('src',data.shopCoverImag);
			
			$('#map-w').val(data.latitude);
			$('#map-n').val(data.longitude);
			$('.shoptel').html('电话 : ' +   data.shopTel);
		//$('.mdimgs img').attr('src',);
			var yourString=data.shopImag;
			var result=yourString.split(",");
			var imgarray = "";
			for(var i=0; i<result.length; i++)
			{
				imgarray = imgarray +"<img  src='"+result[i]+"'>";
			}
			
			$('.mdimgs').html(imgarray);
			$('.list-de-right img').click(function(event){
			event.stopPropagation();
			$('.openimg').show();
			$('.openimg img').attr('src',$(this).attr('src'));
			});
		

		$('.pass').click(function(){
			
			$.ajax({
				type:"POST",
				url:uploadpost,
				data:{
					paramJson:jsons,
					id:sucid
				},success:function(data){
					alert('审核成功');
				}
				
			})
			
		})	
		}
	})
	
}



})
