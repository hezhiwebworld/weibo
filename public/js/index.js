
$(function(){
	//获取元素
	var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');
	
	//跳转到注册页面
	 $loginBox.find('a.colMint').on('click', function() {
        $registerBox.show();
        $loginBox.hide();
    });
	//跳转到登录页面
	 $registerBox.find('a.colMint').on('click', function() {
        $registerBox.hide();
        $loginBox.show();
    });
	
	
	//注册
	$registerBox.find('button').on('click', function() {
        //通过ajax提交请求
        $.ajax({
			
			//类型
            type: 'post',
            url: '/api/user/register',   //后台接受的地方
			//提交的数据
            data: {
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val(),
                repassword:  $registerBox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function(result) {
              
				$registerBox.find('.colWarning').html(result.message);
				if(!result.code){
					setTimeout(function(){
						 $registerBox.hide();
						 $loginBox.show();
					},1000)
				}
            }
        });
    });
	
	//登录
		$loginBox.find('button').on('click', function() {
        //通过ajax提交请求
        $.ajax({
			
			//类型
            type: 'post',
            url: '/api/user/login',   //后台接受的地方
			//提交的数据
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
              
            },
            dataType: 'json',
            success: function(result) {
              
				$registerBox.find('.colWarning').html(result.message);
				if(!result.code){
					setTimeout(function(){
						 $registerBox.hide();
						 $loginBox.show();
					},1000)
				}
            }
        });
    });
	
	
	
	
})










































