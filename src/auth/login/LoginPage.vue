<!-- <script>

    </script> -->


<template>
<h1>Login page</h1>
<h2>Task Manager</h2>
<div class="container" id="container">
	<div class="form-container sign-up-container">
		<form action="#">
			<h1>Create Account</h1>
			<input type="email" placeholder="Email" />
			<input type="text" placeholder="Имя" />
			<input type="text" placeholder="Фамилия" />
			<input type="password" placeholder="Password" />
			<input type="number" placeholder="Номер Телефона" />
			<!-- <input type="text" placeholder="Телеграм айди" /> -->
			<!-- <select id="users" v-model="newTask.assigned"  @change="console.log('assigned', newTask.assigned)">
				<option v-for="user in users" :key="user.id" :value="Number(user.id)">
					{{ user.first_name }}  
				</option>
			</select> 
				<br><br>
				<label class="label-name">Название проекта:</label>
				<select v-model="newTask.projects"  @change="console.log('project', newTask.projects)">
<option v-for="project in projects" :key="project.id" :value="project.id">
{{ project.project_name }}
</option>
</select> -->
			<button>Sign Up</button>
		</form>
	</div>
	<div class="form-container sign-in-container">
		<form action="#">
			<h1>Sign in</h1>
			<input type="email" placeholder="Email" />
			<input type="password" placeholder="Password" />
			<a href="#">Forgot your password?</a>
			<button>Sign In</button>
		</form>
	</div>
	<div class="overlay-container">
		<div class="overlay">
			<div class="overlay-panel overlay-left">
				<h1>Welcome Back!</h1>
				<p>To keep connected with us please login with your personal info</p>
				<button class="ghost" id="signIn">Sign In</button>
			</div>
			<div class="overlay-panel overlay-right">
				<h1>Hello, Friend!</h1>
				<p>Enter your personal details and start journey with us</p>
				<button class="ghost" id="signUp">Sign Up</button>
			</div>
		</div>
	</div>
</div>
</template>