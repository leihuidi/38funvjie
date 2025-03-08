// 示例：为 "庆祝方式" 列表添加动画效果
const celebrationListItems = document.querySelectorAll('#celebration li');

celebrationListItems.forEach((item, index) => {
    item.classList.add('fade-in');
    item.style.animationDelay = `${index * 0.2}s`;
});
