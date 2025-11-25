// 현재 이미지 인덱스
let currentImageIndex = 0;
const totalImages = 9;

// 방명록 수정 모드 (Firebase용 - messageId 저장)
let editingMessageId = null;

// 방명록 표시 개수 제한
let displayedMessageCount = 3;

// Firebase 방명록 전체 데이터 (전역 저장)
window.allMessages = [];
const galleryImages = [
    'images/4.jpg',
    'images/10.jpg',
    'images/11.jpg',
    'images/45.jpg',
    'images/22.jpg',
    'images/24.jpg',
    'images/32.jpg',
    'images/26.jpg',
    'images/17.jpg'
];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadMessages();
    initScrollAnimation();
    initCalendar();
    initCountdown();
    initGallery();
    initNaverMap();
});


// 갤러리 초기화
function initGallery() {
    // 초기에는 4개만 보이도록 설정 (이미 HTML에서 gallery-item-hidden 클래스가 적용되어 있음)
    // 추가로 display 스타일도 설정
    const hiddenItems = document.querySelectorAll('.gallery-item-hidden');
    hiddenItems.forEach(item => {
        item.style.display = 'none';
    });
}

// 갤러리 더보기
function showMoreGallery() {
    const hiddenItems = document.querySelectorAll('.gallery-item-hidden');
    const moreBtn = document.getElementById('galleryMoreBtn');
    const fadeOverlay = document.getElementById('galleryFadeOverlay');
    
    // expanded 클래스로 상태 확인
    const isExpanded = moreBtn && moreBtn.classList.contains('expanded');
    
    if (!isExpanded) {
        // 숨겨진 항목들 표시 (더보기 → 접기)
        hiddenItems.forEach(item => {
            item.classList.remove('gallery-item-hidden');
            item.style.display = '';
        });
        if (moreBtn) {
            moreBtn.innerHTML = '접기 <span class="gallery-more-arrow">▲</span>';
            moreBtn.classList.add('expanded');
        }
        // 그라데이션 오버레이 숨기기
        if (fadeOverlay) {
            fadeOverlay.classList.add('hidden');
        }
    } else {
        // 다시 숨기기 (접기 → 더보기)
        const allItems = document.querySelectorAll('.gallery-item');
        allItems.forEach((item, index) => {
            if (index >= 4) { // 5번째부터 (0-based index 4)
                item.classList.add('gallery-item-hidden');
                item.style.display = 'none';
            }
        });
        if (moreBtn) {
            moreBtn.innerHTML = '더보기 <span class="gallery-more-arrow">▼</span>';
            moreBtn.classList.remove('expanded');
        }
        // 그라데이션 오버레이 다시 표시
        if (fadeOverlay) {
            fadeOverlay.classList.remove('hidden');
        }
    }
}

// 스크롤 애니메이션
function initScrollAnimation() {
    const sections = document.querySelectorAll('section');
    const greetingContent = document.querySelector('.greeting-content');

    // greeting-content 스크롤 애니메이션
    if (greetingContent) {
        const greetingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        greetingObserver.observe(greetingContent);
    }

    // 다른 섹션들 스크롤 애니메이션
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// 이미지 갤러리 모달
function openModal(index) {
    currentImageIndex = index;
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    if (galleryImages && galleryImages[index]) {
        modalImg.src = galleryImages[index];
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = totalImages - 1;
    } else if (currentImageIndex >= totalImages) {
        currentImageIndex = 0;
    }

    const modalImg = document.getElementById('modalImage');
    if (galleryImages && galleryImages[currentImageIndex]) {
        modalImg.src = galleryImages[currentImageIndex];
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// 지도 앱 열기
function openKakaoMap() {
    // 실제 장소 좌표로 변경하세요
    const placeName = '순천아모르웨딩컨벤션';
    const url = `https://map.kakao.com/link/search/${encodeURIComponent(placeName)}`;
    window.open(url, '_blank');
}

function openNaverMap() {
    // 순천아모르웨딩컨벤션
    const placeName = '순천아모르웨딩컨벤션';
    const address = '전남 순천시 서면 압곡길 94';
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(placeName)}`;
    window.open(url, '_blank');
}

function openTmap() {
    // 구글 지도로 변경 (티맵 대체)
    const placeName = '순천아모르웨딩컨벤션';
    const address = '전남 순천시 서면 압곡길 94';

    // 구글 지도 검색 URL (모바일/PC 모두 작동)
    const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
    window.open(googleMapUrl, '_blank');
}

function openKakaoNavi() {
    // 순천아모르웨딩컨벤션 좌표
    const placeName = '순천아모르웨딩컨벤션';
    const latitude = 34.982261;  // 위도
    const longitude = 127.518579; // 경도
    // 카카오내비 앱 스킴 (좌표로 목적지 설정)
    const kakaoNaviUrl = `kakaomap://route?ep=${latitude},${longitude}&by=CAR`;

    // 앱 스킴 시도
    window.location.href = kakaoNaviUrl;

    // 1초 후 앱이 안 열리면 카카오맵 웹으로 폴백
    setTimeout(() => {
        window.open(`https://map.kakao.com/link/to/${encodeURIComponent(placeName)},${latitude},${longitude}`, '_blank');
    }, 1000);
}

function viewMapImage() {
    // 약도 이미지를 모달로 표시
    const mapImagePath = 'images/map-guide.jpg'; // 약도 이미지 경로

    // 이미지 존재 확인을 위해 시도
    const img = new Image();
    img.onload = function() {
        // 이미지가 존재하면 갤러리 모달 활용
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');

        modalImg.src = mapImagePath;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };
    img.onerror = function() {
        // 이미지가 없으면 토스트 메시지
        showToast('약도 이미지를 준비 중입니다');
    };
    img.src = mapImagePath;
}

// 계좌 섹션 토글
function toggleAccountSection(type) {
    const content = document.getElementById(type + 'Content');
    const arrow = document.getElementById(type + 'Arrow');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        arrow.classList.add('open');
    } else {
        content.style.display = 'none';
        arrow.classList.remove('open');
    }
}

// 계좌번호 복사
function copyAccount(bankName, accountNumber) {
    const accountInfo = `${bankName} ${accountNumber}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(accountInfo).then(() => {
            showToast('계좌정보가 복사되었습니다');
        }).catch(err => {
            console.error('복사 실패:', err);
            fallbackCopy(accountInfo);
        });
    } else {
        fallbackCopy(accountInfo);
    }
}

// 구형 브라우저용 복사 함수
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        showToast('계좌정보가 복사되었습니다');
    } catch (err) {
        showToast('복사에 실패했습니다');
    }

    document.body.removeChild(textArea);
}

// 카카오페이 송금하기
function sendKakaoPay(bankName, accountNumber, accountHolder) {
    // 계좌정보 복사
    const accountInfo = `${bankName} ${accountNumber}`;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(accountInfo).then(() => {
            showToast('계좌정보가 복사되었습니다');
        }).catch(err => {
            console.error('복사 실패:', err);
        });
    }

    // 카카오페이 앱 실행
    // 카카오톡 > 더보기 > Pay > 송금 화면으로 이동
    const kakaoPayUrl = 'kakaotalk://kakaopay/home';

    // 앱 실행 시도
    const appOpenAttempt = window.open(kakaoPayUrl, '_self');

    // 앱이 안 열릴 경우 대비
    setTimeout(() => {
        if (!document.hidden) {
            // 앱이 실행되지 않은 경우
            if (confirm(`${accountInfo}\n${accountHolder}\n\n계좌정보가 복사되었습니다.\n카카오페이를 실행하시겠습니까?`)) {
                // 카카오톡 실행 (카카오페이는 카카오톡 안에 있음)
                window.location.href = 'kakaotalk://';
            }
        }
    }, 500);
}

// 방명록 관련 함수
function focusGuestbook() {
    showGuestbookForm();
}

function showGuestbookForm() {
    const form = document.getElementById('guestbookForm');
    const submitButton = form ? form.querySelector('button') : null;

    if (form) {
        const isHidden = form.style.display === 'none';
        form.style.display = isHidden ? 'block' : 'none';

        // 새로 작성할 때는 수정 모드 해제 및 버튼 텍스트 원래대로
        if (isHidden) {
            editingMessageId = null;
            if (submitButton) {
                submitButton.textContent = '메시지 남기기';
            }
            // 입력 필드 초기화
            const nameInput = document.getElementById('guestName');
            const passwordInput = document.getElementById('guestPassword');
            const messageInput = document.getElementById('guestMessage');
            if (nameInput) nameInput.value = '';
            if (passwordInput) passwordInput.value = '';
            if (messageInput) messageInput.value = '';
        }
    }
}


// 방명록 메시지 저장 및 불러오기 (Firebase)
async function submitMessage() {
    const nameInput = document.getElementById('guestName');
    const passwordInput = document.getElementById('guestPassword');
    const messageInput = document.getElementById('guestMessage');

    const name = nameInput.value.trim();
    const password = passwordInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
        showToast('이름을 입력해주세요');
        return;
    }

    if (!password) {
        showToast('비밀번호를 입력해주세요');
        return;
    }

    if (!message) {
        showToast('메시지를 입력해주세요');
        return;
    }

    const { collection, addDoc, updateDoc, doc } = window.firestoreModules;

    try {
        // 수정 모드인 경우
        if (editingMessageId !== null) {
            const messageRef = doc(window.db, 'guestbook', editingMessageId);
            await updateDoc(messageRef, {
                name: name,
                password: password,
                message: message
            });
            editingMessageId = null;
            showToast('메시지가 수정되었습니다');
        } else {
            // 새 메시지 작성
            const messageData = {
                name: name,
                password: password,
                message: message,
                date: new Date().toISOString()
            };
            await addDoc(collection(window.db, 'guestbook'), messageData);
            showToast('메시지가 등록되었습니다');
        }

        // 입력 필드 초기화
        nameInput.value = '';
        passwordInput.value = '';
        messageInput.value = '';

        // 폼 숨기기 및 버튼 텍스트 원래대로
        const form = document.getElementById('guestbookForm');
        const submitButton = form ? form.querySelector('button') : null;
        if (form) {
            form.style.display = 'none';
        }
        if (submitButton) {
            submitButton.textContent = '메시지 남기기';
        }
        editingMessageId = null;
    } catch (error) {
        console.error('메시지 저장 오류:', error);
        showToast('메시지 저장에 실패했습니다');
    }
}

// Firebase에서 실시간으로 메시지 불러오기
function loadMessages() {
    const { collection, query, orderBy, onSnapshot } = window.firestoreModules;
    const messageList = document.getElementById('messageList');
    const moreContainer = document.getElementById('guestbookMoreContainer');
    const emptyBox = document.getElementById('guestbookEmptyBox');

    if (!window.db) {
        console.error('Firebase가 초기화되지 않았습니다');
        return;
    }

    // 실시간 리스너 설정 (날짜 내림차순)
    const q = query(collection(window.db, 'guestbook'), orderBy('date', 'desc'));

    onSnapshot(q, (snapshot) => {
        window.allMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const messages = window.allMessages;

        if (messages.length === 0) {
            messageList.innerHTML = '';
            if (moreContainer) {
                moreContainer.style.display = 'none';
            }
            if (emptyBox) {
                emptyBox.style.display = 'flex';
            }
            return;
        }

        if (emptyBox) {
            emptyBox.style.display = 'none';
        }

        // 표시할 메시지 개수 결정
        const messagesToShow = messages.slice(0, displayedMessageCount);
        const hasMore = messages.length > displayedMessageCount;

        messageList.innerHTML = messagesToShow.map((msg) => {
            const date = new Date(msg.date);
            const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
            const messageContent = escapeHtml(msg.message);
            const name = escapeHtml(msg.name);

            return `
                <div class="message-item">
                    <div class="message-top">
                        <span class="message-name">${name}</span>
                        <div class="message-buttons">
                            <span class="message-edit" onclick="editMessage('${msg.id}')">✎</span>
                            <span class="message-close" onclick="deleteMessage('${msg.id}')">×</span>
                        </div>
                    </div>
                    <div class="message-content">${messageContent}</div>
                </div>
            `;
        }).join('');

        // 더보기/접기 버튼 표시/숨김
        if (moreContainer) {
            const moreBtn = document.getElementById('guestbookMoreBtn');
            if (hasMore || displayedMessageCount >= messages.length) {
                moreContainer.style.display = 'block';
                if (moreBtn) {
                    if (displayedMessageCount >= messages.length && messages.length > 3) {
                        moreBtn.innerHTML = '접기 <span class="guestbook-more-arrow">▲</span>';
                    } else {
                        moreBtn.innerHTML = '더보기 <span class="guestbook-more-arrow">▼</span>';
                    }
                }
            } else {
                moreContainer.style.display = 'none';
            }
        }
    });
}

// 더보기 기능
function showMoreMessages() {
    const messages = window.allMessages || [];
    const moreBtn = document.getElementById('guestbookMoreBtn');

    // 현재 모든 메시지가 표시되고 있는지 확인
    if (displayedMessageCount >= messages.length) {
        // 접기: 다시 3개만 표시
        displayedMessageCount = 3;
        if (moreBtn) {
            moreBtn.innerHTML = '더보기 <span class="guestbook-more-arrow">▼</span>';
        }
    } else {
        // 더보기: 모든 메시지 표시
        displayedMessageCount = messages.length;
        if (moreBtn) {
            moreBtn.innerHTML = '접기 <span class="guestbook-more-arrow">▲</span>';
        }
    }

    // 다시 렌더링 (onSnapshot이 자동으로 처리하지만 즉시 반영을 위해)
    loadMessages();
}

// 방명록 삭제 (Firebase)
async function deleteMessage(messageId) {
    const messages = window.allMessages || [];
    const message = messages.find(m => m.id === messageId);

    if (!message) {
        showToast('메시지를 찾을 수 없습니다');
        return;
    }

    // 비밀번호 확인
    const password = prompt('비밀번호를 입력해주세요:');

    if (password === null) {
        return;
    }

    if (password !== message.password) {
        showToast('비밀번호가 일치하지 않습니다');
        return;
    }

    // 비밀번호가 맞으면 삭제
    const { deleteDoc, doc } = window.firestoreModules;

    try {
        await deleteDoc(doc(window.db, 'guestbook', messageId));
        showToast('메시지가 삭제되었습니다');
    } catch (error) {
        console.error('삭제 오류:', error);
        showToast('메시지 삭제에 실패했습니다');
    }
}

// 방명록 수정 (Firebase)
function editMessage(messageId) {
    const messages = window.allMessages || [];
    const message = messages.find(m => m.id === messageId);

    if (!message) {
        showToast('메시지를 찾을 수 없습니다');
        return;
    }

    // 비밀번호 확인
    const password = prompt('비밀번호를 입력해주세요:');

    if (password === null) {
        return;
    }

    if (password !== message.password) {
        showToast('비밀번호가 일치하지 않습니다');
        return;
    }

    // 비밀번호가 맞으면 수정 폼 표시
    const nameInput = document.getElementById('guestName');
    const passwordInput = document.getElementById('guestPassword');
    const messageInput = document.getElementById('guestMessage');
    const form = document.getElementById('guestbookForm');
    const submitButton = form ? form.querySelector('button') : null;

    if (nameInput && passwordInput && messageInput && form) {
        nameInput.value = message.name;
        passwordInput.value = message.password;
        messageInput.value = message.message;

        // 수정 모드로 설정 (messageId 저장)
        editingMessageId = messageId;

        // 버튼 텍스트 변경
        if (submitButton) {
            submitButton.textContent = '메시지 수정하기';
        }

        form.style.display = 'block';

        // 폼이 보이도록 스크롤
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// XSS 방지를 위한 HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 카카오톡 공유
function shareKakao() {
    // 카카오 SDK를 초기화하고 사용하려면 카카오 개발자 앱 키가 필요합니다
    // https://developers.kakao.com/ 에서 앱을 생성하고 JavaScript 키를 받으세요

    if (typeof Kakao === 'undefined') {
        showToast('카카오톡 공유 기능을 준비 중입니다');
        return;
    }

    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '우리 결혼합니다',
            description: '소중한 분들을 초대합니다',
            imageUrl: window.location.origin + '/path/to/image.jpg',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href
            }
        },
        buttons: [
            {
                title: '청첩장 보기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            }
        ]
    });
}

// 페이스북 공유
function shareFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

// URL 복사
function copyURL() {
    const url = window.location.href;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('URL이 복사되었습니다');
        }).catch(err => {
            console.error('복사 실패:', err);
            fallbackCopy(url);
        });
    } else {
        fallbackCopy(url);
    }
}

// 토스트 메시지 표시
function showToast(message) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 3초 후 제거
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// D-Day 계산 (필요시 사용)
function calculateDday(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    const diff = target - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
        return `D-${days}`;
    } else if (days === 0) {
        return 'D-Day';
    } else {
        return `D+${Math.abs(days)}`;
    }
}

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 모바일 터치 스와이프로 갤러리 이미지 넘기기
let touchStartX = 0;
let touchEndX = 0;

document.getElementById('imageModal').addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.getElementById('imageModal').addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        changeImage(1); // 왼쪽으로 스와이프 - 다음 이미지
    }
    if (touchEndX > touchStartX + 50) {
        changeImage(-1); // 오른쪽으로 스와이프 - 이전 이미지
    }
}

// 이미지 프리로드 (성능 향상)
function preloadImages() {
    if (galleryImages) {
        galleryImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
}

// 페이지 로드 완료 후 이미지 프리로드
window.addEventListener('load', preloadImages);

// 사진 업로드 함수
// Google Drive API 설정
const GOOGLE_CLIENT_ID = '406271324350-j9o25t29vvik2esl47nd4klsvj5cs6as.apps.googleusercontent.com';
const GOOGLE_API_KEY = 'AIzaSyBCPLJavVEdyApoHPBryQE8esEBGHpZZzA';
const GOOGLE_DRIVE_FOLDER_ID = '1vOYtfgDdZuiV5yvEM2k506nsYhONMHP8';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let isGoogleApiLoaded = false;
let isGoogleSignedIn = false;

// Google API 로드
function loadGoogleApi() {
    gapi.load('client:auth2', initGoogleClient);
}

// Google Client 초기화
function initGoogleClient() {
    gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        clientId: GOOGLE_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: SCOPES
    }).then(() => {
        isGoogleApiLoaded = true;
        const authInstance = gapi.auth2.getAuthInstance();
        isGoogleSignedIn = authInstance.isSignedIn.get();
    }).catch(error => {
        console.error('Google API 초기화 오류:', error);
    });
}

// 사진 업로드 버튼 클릭
function uploadPhoto() {
    if (!isGoogleApiLoaded) {
        loadGoogleApi();
        setTimeout(() => {
            uploadPhoto();
        }, 1000);
        return;
    }

    const authInstance = gapi.auth2.getAuthInstance();

    if (!authInstance.isSignedIn.get()) {
        // 구글 로그인
        authInstance.signIn().then(() => {
            document.getElementById('photoInput').click();
        }).catch(error => {
            console.error('로그인 오류:', error);
            showToast('구글 로그인이 필요합니다');
        });
    } else {
        document.getElementById('photoInput').click();
    }
}

// 파일 선택 후 처리
async function handlePhotoSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    const uploadProgress = document.getElementById('uploadProgress');
    const uploadStatus = document.getElementById('uploadStatus');

    uploadProgress.style.display = 'block';
    uploadStatus.textContent = `0 / ${files.length} 업로드 중...`;

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
        try {
            await uploadToGoogleDrive(files[i]);
            successCount++;
            uploadStatus.textContent = `${successCount} / ${files.length} 업로드 중...`;
        } catch (error) {
            console.error('업로드 오류:', error);
            failCount++;
        }
    }

    uploadProgress.style.display = 'none';

    if (failCount > 0) {
        showToast(`${successCount}개 업로드 성공, ${failCount}개 실패`);
    } else {
        showToast(`${successCount}개의 사진이 업로드되었습니다!`);
    }

    // 파일 입력 초기화
    event.target.value = '';
}

// Google Drive에 파일 업로드
function uploadToGoogleDrive(file) {
    return new Promise((resolve, reject) => {
        const metadata = {
            name: file.name,
            mimeType: file.type,
            parents: [GOOGLE_DRIVE_FOLDER_ID]
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + gapi.auth.getToken().access_token }),
            body: form
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                resolve(data);
            } else {
                reject(data);
            }
        })
        .catch(error => reject(error));
    });
}

// 페이지 로드 시 Google API 초기화
window.addEventListener('load', () => {
    if (typeof gapi !== 'undefined') {
        loadGoogleApi();
    }
});

// 달력 생성
function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;

    // 2026년 1월 달력 생성
    const year = 2026;
    const month = 0; // 1월 (0부터 시작)
    const weddingDay = 11;

    // 해당 월의 첫 번째 날짜
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay(); // 0(일요일) ~ 6(토요일)
    const daysInMonth = lastDay.getDate();

    // 이전 달의 마지막 날짜들
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    calendarGrid.innerHTML = '';

    // 이전 달의 날짜들 (빈 칸 채우기)
    for (let i = startDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = prevMonthLastDay - i;
        calendarGrid.appendChild(day);
    }

    // 현재 달의 날짜들
    for (let date = 1; date <= daysInMonth; date++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        if (date === weddingDay) {
            day.classList.add('wedding-day');
        }
        day.textContent = date;
        calendarGrid.appendChild(day);
    }

    // 다음 달의 날짜들 (달력 완성)
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6주 * 7일 = 42
    for (let date = 1; date <= remainingCells; date++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = date;
        calendarGrid.appendChild(day);
    }
}

// 카운트다운 타이머
function initCountdown() {
    const countdownDays = document.getElementById('countdownDays');
    const countdownHours = document.getElementById('countdownHours');
    const countdownMinutes = document.getElementById('countdownMinutes');
    const countdownSeconds = document.getElementById('countdownSeconds');
    const weddingDayCount = document.getElementById('weddingDayCount');
    
    if (!countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) return;

    // 결혼식 날짜: 2026년 1월 11일 오전 11시
    const weddingDate = new Date('2026-01-11T11:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff <= 0) {
            countdownDays.textContent = '00';
            countdownHours.textContent = '00';
            countdownMinutes.textContent = '00';
            countdownSeconds.textContent = '00';
            if (weddingDayCount) {
                weddingDayCount.textContent = '1';
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownDays.textContent = String(days).padStart(2, '0');
        countdownHours.textContent = String(hours).padStart(2, '0');
        countdownMinutes.textContent = String(minutes).padStart(2, '0');
        countdownSeconds.textContent = String(seconds).padStart(2, '0');
        
        // 날짜 메시지 업데이트
        if (weddingDayCount) {
            weddingDayCount.textContent = days + 1;
        }
    }

    // 즉시 업데이트
    updateCountdown();

    // 1초마다 업데이트
    setInterval(updateCountdown, 1000);
}

// 네이버 지도 초기화
function initNaverMap() {
    // 네이버 지도 API가 로드되었는지 확인
    if (typeof naver === 'undefined') {
        console.error('네이버 지도 API가 로드되지 않았습니다.');
        return;
    }

    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('지도 요소를 찾을 수 없습니다.');
        return;
    }

    // 순천아모르웨딩컨벤션 좌표 (전남 순천시 서면 압곡길 94)
    // 좌표: 위도(latitude), 경도(longitude) 순서
    const weddingLocation = new naver.maps.LatLng(34.982261, 127.518579);

    // 지도 옵션
    const mapOptions = {
        center: weddingLocation,
        zoom: 16,
        zoomControl: true,
        zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT
        }
    };

    // 지도 생성
    const map = new naver.maps.Map('map', mapOptions);

    // 마커 생성
    const marker = new naver.maps.Marker({
        position: weddingLocation,
        map: map,
        title: '순천아모르웨딩컨벤션'
    });

    // 정보창 내용
    const contentString = [
        '<div style="padding:10px;min-width:200px;line-height:1.5;">',
        '   <h4 style="margin:0 0 10px 0;font-size:16px;font-weight:bold;">순천아모르웨딩컨벤션</h4>',
        '   <p style="margin:0;font-size:13px;color:#666;">전남 순천시 서면 압곡길 94</p>',
        '   <p style="margin:5px 0 0 0;font-size:13px;color:#666;">Tel. 061-752-1000</p>',
        '</div>'
    ].join('');

    // 정보창 생성
    const infowindow = new naver.maps.InfoWindow({
        content: contentString
    });

    // 마커 클릭 시 정보창 표시
    naver.maps.Event.addListener(marker, 'click', function() {
        if (infowindow.getMap()) {
            infowindow.close();
        } else {
            infowindow.open(map, marker);
        }
    });

    // 기본으로 정보창 열어두기
    infowindow.open(map, marker);
}
