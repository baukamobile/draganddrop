<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
import StatisticsSection from '@/components/pages/dashboard/StatisticsSection.vue'
import SalesSection from '@/components/pages/dashboard/SalesSection.vue'
import LatestSection from '@/components/pages/dashboard/LatestSection.vue'
import Button from '@/components/Button.vue'
// This adds some nice ellipsis to the description:
document.querySelectorAll(".projcard-description").forEach(function(box) {
	$clamp(box, {clamp: 6});
});

</script>

<template>
    <PageWrapper>
        <template #header>  
      <div class="projcard-container">
		
    <div class="projcard projcard-blue">
      <div class="projcard-innerbox">
        <img class="projcard-img" src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/01/bd/a3/see-two-for-the-price.jpg?w=900&h=500&s=1" />
        <div class="projcard-textbox">
          <div class="projcard-title">Праздник</div>
          <div class="projcard-subtitle">Наурыз мейрамы</div>
          <div class="projcard-bar"></div>
          <div class="projcard-description">Наурыз мейрамы — ежелгі заманнан қалыптасқан жыл бастау мейрамы. Қазіргі күнтізбе бойынша (наурыздың 22) күн мен түннің теңесуі кезіне келеді. Көне парсы тілінде нава=жаңа + рәзаңһ=күн, «жаңа күн» мағынасында, қазіргі парсы тілінде де сол мағынамен қалған (но=жаңа + роуз=күн; мағынасы «жаңа күн»), яғни «жаңа жылды» (күн өсуін белгілеуі) білдіреді.
2010 жылдың 10 мамырынан бастап Біріккен Ұлттар Ұйымының Бас ассамблеясының 64-қарарына сәйкес 21 наурыз "Халықаралық Наурыз күні" болып аталып келеді.[1] Бас ассамблея өзінің берген түсініктемесінде "Наурызды көктем мерекесі ретінде 3000 жылдан бері Балқан түбегінде, Қара теңіз аймағында, Кавказда, Орта Азияда және Таяу Шығыста 300 миллион адам тойлап келе жатқандығын" мәлімдеді. Ал ЮНЕСКО болса, 2009 жылдың 30 қыркүйегінде Наурыз мейрамын адамзаттың материалдық емес мәдени мұра тізіміне кіргізді.
          </div>
          <div class="projcard-tagbox">
            <span class="projcard-tag">Праздник</span>
            <span class="projcard-tag">Выходной</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="projcard projcard-red">
      <div class="projcard-innerbox">
        <img class="projcard-img" src="https://picsum.photos/800/600?image=1080" />
        <div class="projcard-textbox">
          <div class="projcard-title">That's Another Card</div>
          <div class="projcard-subtitle">I don't really think that I need to explain anything here</div>
          <div class="projcard-bar"></div>
          <div class="projcard-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
          <div class="projcard-tagbox">
            <span class="projcard-tag">PHP</span>
            <span class="projcard-tag">SQL</span>
            <span class="projcard-tag">Database</span>
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
    </div>
    
  </div>
    
    
        </template>

   
    </PageWrapper>
</template>
<style scoped>
body {
	font-family: 'Open Sans', arial, sans-serif;
	color: #333;
	font-size: 14px;
}
.projcard-container {
	margin: 50px 0;
}

/* Actual Code: */
.projcard-container,
.projcard-container * {
	box-sizing: border-box;
}
.projcard-container {
	margin-left: auto;
	margin-right: auto;
	width: 1100px;
  /* height: ; */
}
.projcard {
	position: relative;
	width: 100%;
	height: 500px;
	margin-bottom: 40px;
	border-radius: 10px;
	background-color: #fff;
	border: 2px solid #ddd;
	font-size: 18px;
	overflow: hidden;
	/* cursor: pointer; */
	box-shadow: 0 4px 21px -12px rgba(0, 0, 0, .66);
	transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.projcard:hover {
	box-shadow: 0 34px 32px -33px rgba(0, 0, 0, .18);
	transform: translate(0px, -3px);
}
.projcard::before {
	content: "";
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-image: linear-gradient(-70deg, #424242, transparent 50%);
	opacity: 0.07;
}
.projcard:nth-child(2n)::before {
	background-image: linear-gradient(-250deg, #424242, transparent 50%);
}
.projcard-innerbox {
  width: 900px;
  height: 900px;
	/* position: absolute; */
	/* top: 300;
	right: 0;
	bottom: 0;
	left: 0; */
}
.projcard-img {
	position: absolute;
	height: 500px;
	width: 390px;
	top: 0;
	left: 0;
	transition: transform 0.2s ease;
}
.projcard:nth-child(2n) .projcard-img {
	left: initial;
	right: 0;
}
.projcard:hover .projcard-img {
	transform: scale(1.05) rotate(1deg);
}
.projcard:hover .projcard-bar {
	width: 70px;
}
.projcard-textbox {
	position: absolute;
	top: 7%;
	bottom: 7%;
	left: 430px;
	width: calc(100% - 470px);
	font-size: 17px;
}
.projcard:nth-child(2n) .projcard-textbox {
	left: initial;
	right: 430px;
}
.projcard-textbox::before,
.projcard-textbox::after {
	content: "";
	position: absolute;
	display: block;
	background: #000000;
	background: #fff;
	top: -20%;
	left: -55px;
	height: 140%;
	width: 60px;
	transform: rotate(8deg);
}
.projcard:nth-child(2n) .projcard-textbox::before {
	display: none;
}
.projcard-textbox::after {
	display: none;
	left: initial;
	right: -55px;
}
.projcard:nth-child(2n) .projcard-textbox::after {
	display: block;
}
.projcard-textbox * {
	position: relative;
}
.projcard-title {
	font-family: 'Voces', 'Open Sans', arial, sans-serif;
	font-size: 24px;
  color: #000000;
}
.projcard-subtitle {
	font-family: 'Voces', 'Open Sans', arial, sans-serif;
  font-weight: bold;
	color: #000000;
}
.projcard-bar {
	left: -2px;
	width: 50px;
	height: 5px;
	margin: 10px 0;
	border-radius: 5px;
	background-color: #000000;
	transition: width 0.2s ease;
}
.projcard-blue .projcard-bar { background-color: #000000; }
.projcard-blue::before { background-image: linear-gradient(-70deg, #000000, transparent 50%); }
.projcard-blue:nth-child(2n)::before { background-image: linear-gradient(-250deg, #000000, transparent 50%); }
.projcard-red .projcard-bar { background-color: #000000; }
.projcard-red::before { background-image: linear-gradient(-70deg, #000000, transparent 50%); width: 50px;}
.projcard-red:nth-child(2n)::before { background-image: linear-gradient(-250deg, #000000, transparent 50%); }
.projcard-green .projcard-bar { background-color: #000000; }
.projcard-green::before { background-image: linear-gradient(-70deg, #000000, transparent 50%); }
.projcard-green:nth-child(2n)::before { background-image: linear-gradient(-250deg, #000000, transparent 50%); }
.projcard-yellow .projcard-bar { background-color: #000000; }
.projcard-yellow::before { background-image: linear-gradient(-70deg, #000000, transparent 50%); }
.projcard-yellow:nth-child(2n)::before { background-image: linear-gradient(-250deg, #000000, transparent 50%); }
.projcard-orange .projcard-bar { background-color: #000000; }
.projcard-orange::before { background-image: linear-gradient(-70deg, #000000, transparent 50%); }
.projcard-orange:nth-child(2n)::before { background-image: linear-gradient(-250deg, #000000, transparent 50%); }
.projcard-brown .projcard-bar { background-color: #000000; }
.projcard-brown::before { background-image: linear-gradient(-70deg, #000000, transparent 50%); }
.projcard-brown:nth-child(2n)::before { background-image: linear-gradient(-250deg, #000000, transparent 50%); }
.projcard-grey .projcard-bar { background-color: #000000; }
.projcard-grey::before { background-image: linear-gradient(-70deg, #000000, transparent 50%); }
.projcard-grey:nth-child(2n)::before { background-image: linear-gradient(-250deg, #000000, transparent 50%); }
.projcard-customcolor .projcard-bar { background-color: var(--projcard-color); }
.projcard-customcolor::before { background-image: linear-gradient(-70deg, var(--projcard-color), transparent 50%); }
.projcard-customcolor:nth-child(2n)::before { background-image: linear-gradient(-250deg, var(--projcard-color), transparent 50%); }
.projcard-description {
	/* z-index: 10; */
  overflow-y: hidden;
	font-size: 15px;
	color: #000000;
	max-height: 200px;
	/* overflow-x: hidden; */
    overflow-y: auto;
    user-select: none;
    overflow-wrap: break-word;
	/* text-overflow: ellipsis; */
}
.projcard-tagbox {
	position: absolute;
	bottom: 3%;
	font-size: 14px;
	cursor: default;
	user-select: none;
	pointer-events: none;
}
.projcard-tag {
	display: inline-block;
	background: #E0E0E0;
	color: #000000;
	border-radius: 3px 0 0 3px;
	line-height: 26px;
	padding: 0 10px 0 23px;
	position: relative;
	margin-right: 20px;
	cursor: auto;
	user-select: none;
	transition: color 0.2s;
}
.projcard-tag::before {
	content: '';
	position: absolute;
	background: #fff;
	border-radius: 10px;
	box-shadow: inset 0 1px rgba(0, 0, 0, 0.25);
	height: 6px;
	left: 10px;
	width: 6px;
	top: 10px;
  cursor: pointer;
}
.projcard-tag::after {
	content: '';
	position: absolute;
  cursor: pointer;
	border-bottom: 13px solid transparent;
	border-left: 10px solid #E0E0E0;
	border-top: 13px solid transparent;
	right: -10px;
	top: 0;
}
</style>