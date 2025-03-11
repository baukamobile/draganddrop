<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
import StatisticsSection from '@/components/pages/dashboard/StatisticsSection.vue'
import SalesSection from '@/components/pages/dashboard/SalesSection.vue'
import LatestSection from '@/components/pages/dashboard/LatestSection.vue'
import Button from '@/components/Button.vue'
</script>

<template>
    <PageWrapper>
        <template #header>
            
            <div class="container">
      <div class="square">
        <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/01/bd/a3/see-two-for-the-price.jpg?w=900&h=500&s=1" class="mask">
     <div class="h1">Is Apple a Design Company?</div>
        <p>Apple is more than a tech company; it became a culture unto itself, a passion of most of people and the birthplace of the world’s most revolutionized products.</p>
        
     <div><a href="https://medium.com/@laheshk/is-apple-a-design-company-f5c83514e261" target="_" class="button">Read More</a></div>
      </div>
      
      
      
      </div>
      
      
    
    
        </template>

   
    </PageWrapper>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Merriweather|Open+Sans');

.container{
  /* display: flex; */
  /* justify-content: center; */
  /* padding: 5px; */
  width: 700px;
  height: 200px;
}

/* .square:hover {
    -webkit-transform: translate(20px, -10px);
    -ms-transform: translate(10px, -10px);
    transform: translate(10px, -10px);
    -webkit-box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
     } */


.square{
  width: 760px;
	height: 430px;
	background: white;
  border-radius: 4px;
  /* box-shadow: 0px 20px 50px #D9DBDF; */
  /* -webkit-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;  */
}

.mask{
  /* clip: rect(0px, 460px, 220px, 0px); */
  border-radius: 4px;
  /* position: absolute; */
  width: 760px;
  height: 250px;
}

img{
  width: 460px;
  }

.h1{
  /* margin: auto; */
  text-align: left;
  margin-top: 20px;
  padding-left: 30px;
  color: black;
  font-family: 'Merriweather', serif;
  font-size: 24px;
}
p{
 text-align: justify; 
 padding-left: 30px;
 padding-right: 30px;
 font-family: 'Open Sans', sans-serif;
 font-size: 12px;
 color: #000000;
 line-height: 18px;
}

.button {
    background-color: #3EDD84;
    color: white;
    width: 90px;
    padding: 10px 18px;
    border-radius: 3px;
    text-align: center;
    text-decoration: none;
    display: block;
    margin-top: 20px;
    margin-left: 30px;
    margin-right: 70px;
    font-size: 12px;
    cursor: pointer;
    font-family: 'merriweather';
}
</style>