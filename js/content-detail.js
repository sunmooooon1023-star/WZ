
/* header */
document.querySelector("#searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const WORD = document.getElementById('mainSearch').value.trim();

    if (WORD.length === 0) {
        alert("검색어를 입력해주세요");
        return;
    }

    window.location.href = `index.html?query=${encodeURIComponent(WORD)}`;
});
/* json */
const fetchData = async () => {
    const res = await fetch('data.json');
    const data = await res.json();
    const dataArray = Object.values(data);
    return dataArray;
}


/* render */

document.addEventListener('DOMContentLoaded', async () => {
    const URL = new URLSearchParams(window.location.search);
    const query = URL.get('query')?.toLowerCase() || '';

    if (!query) return;

    const data = await fetchData();
    const DataAll = data.find(item => item.id.toLowerCase() === query);

    if (DataAll) {
        const Main = document.getElementById('detail-main');
        const Info1 = document.getElementById('work-info');
        const Episode = document.getElementById('episode-list');

        const MainDiv = document.createElement('div');
        const InfoDiv02 = document.createElement('div');
        const EpisodeDiv = document.createElement('div');

        MainDiv.classList.add('main-text');
        InfoDiv02.classList.add('info02');
        EpisodeDiv.classList.add('episodeAll');

        /* bg css */
        Main.style.background = `
  linear-gradient(to bottom, rgba(0, 0, 0, 0.3), #21252B 99%),
  url(${DataAll.image_default})`;
        Main.style.backgroundRepeat = 'no-repeat';
        Main.style.backgroundPosition = 'center';
        Main.style.backgroundSize = 'cover';


        MainDiv.innerHTML = `
                    <h2>${DataAll.title}</h2>
                    <img src="source/image/content-detail/like01.png" alt="">
                    <img src="source/image/content-detail/top.png" alt="">`
        document.querySelector('.info01 > p').innerHTML = `${DataAll.summary}`;


        /* 관람가 배경색 */
        const rating = DataAll.rating;

        let backgroundColor = "";
        if (rating === 'ALL') {
            backgroundColor = "#1CA40C";
        } else if (rating === '18+') {
            backgroundColor = "#D60000";
        } else if (rating === '15+') {
            backgroundColor = "#DD8100";
        } else {
            backgroundColor = "#E5B200";
        }


        const korCategory =  
           { animation: "애니메이션",
            movie: "영화",
            drama: "드라마",
            musical: "뮤지컬",
            documentary: "다큐멘터리",
            varietyShow: "예능"}
        

        const kor = korCategory[DataAll.category] || DataAll.category;

        InfoDiv02.innerHTML = `
                        <h3><span style="background-color: ${backgroundColor};">${DataAll.rating}</span>작품정보</h3>
                        <ul class="info02-text">
                            ${DataAll.cast && DataAll.cast.length > 0 ? `<li><span>출연 :</span> ${DataAll.cast}</li>` : ''}
                            <li><span>장르 :</span> ${korCategory[DataAll.category]}</li>
                            <li><span>감독 :</span> ${DataAll.director}</li>
                            <li><span>제작사 :</span> ${DataAll.production}</li>
                            <li>${DataAll.tag.map(tag => `#${tag.trim()}`).join(' ')}</li>
                        </ul>
                        <div class="info02-ico">
                        </div>`;

        EpisodeDiv.innerHTML = `
                        <h3>전체회차</h3>
                        <span>전체회차 ${DataAll.episode}개</span>
                        <div class="All-list">    
                        <div class="list">
                        </div>           
                        </div>`


        // 별점,% 랜덤
        function randomstar(min, max) {
            const random = Math.random() * (max - min) + min;
            return random.toFixed(1);
        }

        function randompercent(min, max) {
            const random = Math.random() * (max - min) + min;
            return random.toFixed(1);  // 소수점 첫째자리까지 표시
        }


        const episodehtml = EpisodeDiv.querySelector('.list');

        episodehtml.innerHTML = '';

        for (let i = 0; i < DataAll.episodeGuide.length; i++) {
            const ep = DataAll.episodeGuide[i];
            const starspan = randomstar(3.8, 5.0);
            const percentspan = randompercent(45, 55);
            

            episodehtml.innerHTML += `
                                    <div class="listN">
                                        <a href="${DataAll.video}"><img src="${DataAll.image_default}" alt=""></a>
                                            <div class="list-text">
                                                <h4>${DataAll.title} ${ep.number}화 ${ep.title}</h4>
                                                <div class="list-icons">
                                                <i class="xi-star"><span>${starspan}</span></i> 
                                                <span>${percentspan}</span>
                                                <a href=""><img src="source/image/content-detail/share.png" alt=""></a>
                                                </div>
                                            </div>
                                    </div>`
        }
        Main.appendChild(MainDiv);
        Info1.appendChild(InfoDiv02);
        Episode.appendChild(EpisodeDiv);

    }

    /* 댓글 */
    const ptitles = document.getElementsByClassName('review-text');

    Array.from(ptitles).forEach(title => {
        const p = title.getElementsByTagName('p')[0];
        const span = document.createElement('span');
        span.innerHTML = `${DataAll.title}`;
        p.prepend(span);
    });

})




const renderComments = (reviewText, reviewList, target = "prepend") => {
  const user = JSON.parse(sessionStorage.getItem("member")) || {
    name: "user",
    profile: "source/image/profile.jpg"
  };

  const reviewRender = document.createElement('div');
  reviewRender.classList.add('list');

  reviewRender.innerHTML = `
    <img src="${user.profile}" alt="">
    <span>${user.name}</span>
    <div class="review-text">
      <p>${reviewText}</p>
      <ul class="review-text-icons">
        <li><i class="xi-heart"></i><span class="hNum">0</span></li>
        <li><i class="xi-emoticon-sad"></i><span class="sNum">0</span></li>
      </ul>
    </div>
  `;

  if (target === "prepend") {
    reviewList.prepend(reviewRender);
  } else {
    reviewList.appendChild(reviewRender);
  }

  
    const Heart = reviewRender.querySelector('.xi-heart');
    const Sad = reviewRender.querySelector('.xi-emoticon-sad');
    const HNum = reviewRender.querySelector('.hNum');
    const sNum = reviewRender.querySelector('.sNum');


    Heart.addEventListener('click', function (e) {
        e.preventDefault();
        let heartNum = parseInt(HNum.textContent) || 0;
        heartNum++;
        HNum.textContent = heartNum;
    }, { once: true })

    Sad.addEventListener('click', function (e) {
        e.preventDefault();
        let sadNum = parseInt(sNum.textContent) || 0;
        sadNum++;
        sNum.textContent = sadNum;
    }, { once: true })
};

/* 댓글 클릭이벤트 */
document.getElementById('review-button').addEventListener('click', function (e) {
  e.preventDefault();

  const reviewInput = document.getElementById('review-input');
  const reviewText = reviewInput.value.trim();
  if (reviewText === '') return;

  const reviewList = document.getElementsByClassName('review-list')[0];

  renderComments(reviewText, reviewList, 'prepend');

  reviewInput.value = ''; 

})


/* 댓글 좋아요*/

document.querySelectorAll('.review-text-icons .xi-heart').forEach(item => {
    item.addEventListener('click', function () {
        const Hspan = item.nextElementSibling;
        const HNum = parseInt(Hspan.textContent);
        Hspan.textContent = HNum + 1;
    }, { once: true })
})

document.querySelectorAll('.review-text-icons .xi-emoticon-sad').forEach(item => {
    item.addEventListener('click', function () {
        const Sspan = item.nextElementSibling;
        const SNum = parseInt(Sspan.textContent);
        Sspan.textContent = SNum + 1;
    }, { once: true })
})


/* 공유클릭시 링크복사 */
document.querySelector('.share').addEventListener('click', function () {
    const URL = window.location.href;

    navigator.clipboard.writeText(URL)
        .then(() => {
            alert("링크가 복사되었습니다!");
        })
        .catch(err => {
            alert("링크 복사에 실패했습니다");
            console.error(err);
        });
})