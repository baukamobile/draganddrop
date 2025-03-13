<script setup>
import PageWrapper from '@/components/PageWrapper.vue'

import Button from '@/components/Button.vue'
import './style/style.css'
// import { NewsManager } from "@/views/pages/news/News_Manager";
import { useTaskManager } from "@/views/pages/dashboard/useTaskManger";
import { NewsManager } from './News_manager'
import { EditFilled, DeleteOutlined,CommentOutlined,LikeOutlined,HeartOutlined,  } from "@ant-design/icons-vue";
// This adds some nice ellipsis to the description:
document.querySelectorAll(".projcard-description").forEach(function(box) {
	$clamp(box, {clamp: 6});
});
const {
	formatDate,
} = useTaskManager();
const {
	news,
	NewsObject,
	// formatDate,
	
} = NewsManager();
// onMounted( async () => {
// 	console.log('Теги новости:', newss.tags,typeof newss.tags);
// }

// )
console.log('Теги новости:', news.tags, typeof news.tags);
</script>

<template>
    <PageWrapper>
        <template #header>  
      <div class="projcard-container">
		
    <div class="projcard projcard-blue" v-for="newss in news" :key="newss.id">
      <div class="projcard-innerbox">
		
        <img class="projcard-img" :src="newss.picture"/>
        <div class="projcard-textbox">
          <!-- <div class="projcard-title">Праздник</div> -->
          <div class="projcard-subtitle">{{ newss.title }} <p style="font-weight: 100;"> Опубликован:	{{formatDate(newss.created_at) }} Автор: {{ newss.created_by }}</p></div>
          <div class="projcard-bar"></div>
          <div class="projcard-description">{{newss.content}}
          </div >
		  <div style="display: flex; justify-content: space-evenly;">
		  <HeartOutlined style="color: red;"/> <br>
		  <LikeOutlined style="color: blue;"/><br>
		  <CommentOutlined style="color: green;"/></div>
          <div class="projcard-tagbox">
            <!-- <a href="#" v-for="tag in newss.tags" >{{ tag }}</a> -->
			<a v-for="(tag, index) in newss.tags" :key="index" href="#" class="projcard-tag">{{ tag.name }}</a>
			</div>
        </div>
      </div>
    </div>
    
    <!-- <div class="projcard projcard-red">
      <div class="projcard-innerbox">
        <img class="projcard-img" src="https://picsum.photos/800/600?image=1080" />
        <div class="projcard-textbox">
          <div class="projcard-title">That's Another Card</div>
          <div class="projcard-subtitle">I don't really think that I need to explain anything here</div>
          <div class="projcard-bar"></div>
          <div class="projcard-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          <div class="comment-section">

            <div class="projcard-tagbox">
            <span class="projcard-tag">PHP</span>
          </div>

          </div>
          
         
        </div>
      </div>
    </div>
    
    <div class="projcard projcard-green">
      <div class="projcard-innerbox">
        <img class="projcard-img" src="https://picsum.photos/800/600?image=1039" />
        <div class="projcard-textbox">
          <div class="projcard-title">And a Third Card</div>
          <div class="projcard-subtitle">You know what this is by now</div>
          <div class="projcard-bar"></div>
          <div class="projcard-description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</div>
          <div class="projcard-tagbox">
            <span class="projcard-tag">Excel</span>
            <span class="projcard-tag">VBA</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="projcard projcard-customcolor" style="--projcard-color: #000000;">
      <div class="projcard-innerbox">
        <img class="projcard-img" src="https://picsum.photos/800/600?image=943" />
        <div class="projcard-textbox">
          <div class="projcard-title">Last Card</div>
          <div class="projcard-subtitle">That's the last one. Have a nice day!</div>
          <div class="projcard-bar"></div>
          <div class="projcard-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
          <div class="projcard-tagbox">
            <span class="projcard-tag">iOS</span>
            <span class="projcard-tag">Android</span>
            <span class="projcard-tag">Cordova</span>
          </div>
        </div>
      </div>
    </div> -->
  </div>
        </template>
    </PageWrapper>
</template>
