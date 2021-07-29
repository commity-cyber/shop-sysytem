<template>
    <div class="login-container">
       <div class="login-left">
           <img src="../assets/imgs/img-login.png" alt="">
       </div>
       <div class="login-right">
           <!-- 头像部分 -->
           <div class="tx-box">
               <img src="../assets/imgs/img-tx.png" alt="">
           </div>
           <!-- 标题 -->
           <div class="tittle">
               电商后台管理平台
           </div>
           <!-- 登入的表单 -->
           <div>
               <el-form ref="loginformref"  class="login-from" :model="loginFrom" :rules="loginFromjy">
                   <el-form-item prop="username" >
                     <el-input
                        placeholder="请输入用户名"
                        prefix-icon="iconfont icon-user"
                       v-model="loginFrom.username"
                        >
                     </el-input>
                   </el-form-item>
                   <el-form-item  prop="password">
                     <el-input
                        placeholder="请输入密码"
                        prefix-icon="iconfont icon-lock_fill"
                        v-model="loginFrom.password"
                         show-password
                        >
                     </el-input>
                   </el-form-item>
                   <el-form-item>
                     <el-button type="primary" class="login-button" @click="dr">登入</el-button>
                   </el-form-item>
               </el-form>
           </div>
       </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                // 表单数据的绑定对象
                loginFrom:{
                    username:'admin',
                    password:'123456'
                },
                // 表单校验存储的规则
                loginFromjy:{
                    username: [
                                { required: true, message: '请输入用户名称', trigger: 'blur' },
                                { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
                          ],
                    password: [
                                { required: true, message: '请输入用户密码', trigger: 'blur' },
                                { min:5, max: 16, message: '长度在5 到 16个字符', trigger: 'blur' }
                          ],
                }
            }
        },
        methods:{
            dr(){
                // 通过ref拿到整个表单的值，validate对整个表单校验的方法，参数是回调函数，该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。
                // 参数是形参自己定义的
                this.$refs.loginformref.validate(async valeid=>{
                    if(!valeid){
                        return
                    }
                // 成功校验后在发送登入请求
            const {data:res} = await this.$http.post('login',this.loginFrom)
            if(res.meta.status !== 200){
              return  this.$message.error('登入失败')
            }
                this.$message.success('登入成功')
                // 登入成功将用户信息保存到sessionStorage之中.为他命名为userInfo
                sessionStorage.setItem('userInfo',JSON.stringify(res.data))
                this.$router.push('/home')
                console.log(res)
                })
            }
        }
    }
</script>

<style lang="less" scoped>

    .login-container{
        background: #93defe;
        height: 100%;
        // 水平垂直居中的办法
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        .login-left{
            margin-right: 100px;
        }
        .login-right{
            width: 400px;
            height: 350px;
            background: #fff;
            padding: 50px;
            border-radius: 6px;
            box-sizing: border-box;
            position: relative;
            .tx-box{
                width: 120px;
                height: 120px;
                background: #fff;
                border-radius: 100px;
                border: 5px solid #93defe;
                position: absolute;
                top: -60px;
                right: 140px;
               text-align: center;
               line-height: 120px;
            }
            .tittle{
                position: absolute;
                top: 100px;
                left: 50%;
                transform: translate(-50%);
                font-size: 18px;
                color: #444;
            }
            .login-from{
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translate(-50%);
                padding:0 20px;
                box-sizing: border-box;
                width: 80%;
                .login-button{
                    width: 100% ;
                }
            }
        }
    }
</style>
