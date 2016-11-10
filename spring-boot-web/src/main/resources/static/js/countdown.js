var WINDOW_WIDTH=1024;
var WINDOW_HEIGHT=768;

var RADIUS=8;

var MARGIN_TOP=60;
var MARING_LEFT=30;

//js中的时间 月是从0开始的
//如果是时钟效果  则不需要endtime变量
//const endTime = new Date();
//endTime.setTime(endTime.getTime()+3600*1000);
//由于当前程序小时数是两位数 因此  这里的结束时间与当前时间最好不超过4天

var curShowTimeSeconds=0;

var balls=[];
const colors=["#33b5e5","#0099cc","#aa66cc","#9933cc","#99cc00","#669900","#ffbb33","#ff8800","#ff4444","#cc0000"];

window.onload=function(){
	var canvas=document.getElementById("canvas");

	//为了屏幕的自适应 需要将body的高度设置为100%   canvas的高度也为100%
	WINDOW_WIDTH=document.documentElement.clientWidth || document.body.clientWidth;
	WINDOW_HEIGHT=document.documentElement.clientHeight || document.body.clientHeight;
	//console.log(WINDOW_HEIGHT);
	MARING_LEFT=Math.round(WINDOW_WIDTH/10);
	RADIUS=Math.round(WINDOW_WIDTH*4/5/108)-1;
	MARGIN_TOP=Math.round(WINDOW_HEIGHT/8);

	canvas.width=WINDOW_WIDTH-1;
	canvas.height=WINDOW_HEIGHT-1;

	var context = canvas.getContext("2d");

	start = new Date();
	start.setFullYear(2016);
	start.setMonth(8);
	start.setDate(17);
	start.setHours(9);
	start.setMinutes(46);
	curShowTimeSeconds=getCurrentShowTimeSeconds();

	setInterval(function(){
		render(context);
		update();
		updateDays();
	},50);

}

function updateDays(){
	var end = new Date();
	var diff = parseInt((end-start)/(24*60*60*1000));
	var str = diff+' 天'
	$('.showDay').html(str);
	$('.showDay').attr('data-shadow',str);
}
function getCurrentShowTimeSeconds()
{
	var curTime= new Date();

	//以下是时钟效果的计算
	var ret=curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();
	return ret;


	//以下是倒计时效果的时间计算
	//比较两个时间的毫秒数差距
	/*var ret=endTime.getTime()-curTime.getTime();
	ret=Math.round(ret/1000);
	return ret>=0 ? ret : 0;*/
}

function update(){
	var nextShowTimeSeconds=getCurrentShowTimeSeconds();

	var nextHours =parseInt(nextShowTimeSeconds/3600);
	var nextMinutes =parseInt((nextShowTimeSeconds-3600*nextHours)/60);
	var nextSeconds=nextShowTimeSeconds%60;

	var curHours =parseInt(curShowTimeSeconds/3600);
	var curMinutes =parseInt((curShowTimeSeconds-3600*curHours)/60);
	var curSeconds=curShowTimeSeconds%60;

	if(nextSeconds!=curSeconds){
		//比较小时
		if(parseInt(curHours/10)!=parseInt(nextHours/10)){
			addBalls(MARING_LEFT,MARGIN_TOP,parseInt(curHours/10));
		}
		if(parseInt(curHours%10)!=parseInt(nextHours%10)){
			addBalls(MARING_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
		}

		//比较分钟
		if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
			addBalls(MARING_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
			addBalls(MARING_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
		}
		//比较秒钟
		if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
			addBalls(MARING_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
		}
		if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
			addBalls(MARING_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
		}

		curShowTimeSeconds=nextShowTimeSeconds;
	}

	//更新小球
	updateBalls();
}

function updateBalls(){
	for (var i = 0; i < balls.length; i++) {
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;
		balls[i].vy+=balls[i].g;

		if(balls[i].y>=(WINDOW_HEIGHT - RADIUS)){
			balls[i].y=WINDOW_HEIGHT - RADIUS;
			balls[i].vy*=-0.75;
		}
	}

	//将不在视野内的小球清除掉
	var cnt=0;
	for (var i = 0; i < balls.length; i++) {
		if((balls[i].x+RADIUS)>0 && (balls[i].x - RADIUS) < WINDOW_WIDTH){
			balls[cnt++]=balls[i];
		}
	}

	while(balls.length>Math.min(300,cnt)){
		balls.pop();
	}
}

function addBalls(x,y,num){
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if(digit[num][i][j]==1){
				var aBall={
					x:x+(2*j+1)*(RADIUS+1),
					y:y+(2*i+1)*(RADIUS+1),
					g:1.5+Math.random(),
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]
				};
				balls.push(aBall);
			}
		};
	};
}

function render(ctx){
	//刷新矩形区间操作
	ctx.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
	var hours =parseInt(curShowTimeSeconds/3600);
	var minutes =parseInt((curShowTimeSeconds-3600*hours)/60);
	var seconds=curShowTimeSeconds%60;

	//绘制小时
	renderDigit(MARING_LEFT,MARGIN_TOP,parseInt(hours/10),ctx);
	renderDigit(MARING_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),ctx);

	//绘制冒号
	renderDigit(MARING_LEFT+30*(RADIUS+1),MARGIN_TOP,10,ctx);

	//绘制分钟
	renderDigit(MARING_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),ctx);
	renderDigit(MARING_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),ctx);

	//绘制冒号
	renderDigit(MARING_LEFT+69*(RADIUS+1),MARGIN_TOP,10,ctx);

	//绘制秒钟
	renderDigit(MARING_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),ctx);
	renderDigit(MARING_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),ctx);

	//绘制小球
	for (var i = 0; i < balls.length; i++) {
		ctx.fillStyle=balls[i].color;
		ctx.beginPath();
		ctx.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();
	};

}

function renderDigit(x,y,num,ctx){
	ctx.fillStyle="rgb(0,102,153)";

	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if(digit[num][i][j]==1){
				ctx.beginPath();
				ctx.arc(x+(2*j+1)*(RADIUS+1),y+(2*i+1)*(RADIUS+1),RADIUS,0,2*Math.PI);
				ctx.closePath();
				ctx.fill();
			}
		};
	};
}