// Index page JavaScript

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Schedule box horizontal scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    const scheduleBox = document.querySelector('.schedule-box');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    
    if (scheduleBox && scrollLeftBtn && scrollRightBtn) {
        // Add smooth scrolling behavior
        scheduleBox.style.scrollBehavior = 'smooth';
        
        // Scroll amount (width of one item + margin)
        const scrollAmount = 420; // 400px width + 20px margin
        
        // Buttons are now positioned with CSS, no need for dynamic positioning
        
        // Update button states based on scroll position
        function updateButtonStates() {
            const isAtStart = scheduleBox.scrollLeft <= 0;
            const isAtEnd = scheduleBox.scrollLeft >= (scheduleBox.scrollWidth - scheduleBox.clientWidth);
            
            scrollLeftBtn.disabled = isAtStart;
            scrollRightBtn.disabled = isAtEnd;
        }
        
        // Left scroll button
        scrollLeftBtn.addEventListener('click', function() {
            scheduleBox.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Right scroll button
        scrollRightBtn.addEventListener('click', function() {
            scheduleBox.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Update button states on scroll
        scheduleBox.addEventListener('scroll', updateButtonStates);
        
        // Horizontal scroll on mouse wheel when hovering over the container
        const scheduleContainer = scheduleBox.closest('.schedule-container');
        
        scheduleContainer.addEventListener('wheel', function(e) {
            e.preventDefault(); // Prevent default vertical scrolling
            
            // Scroll horizontally based on wheel direction
            const scrollAmount = e.deltaY > 0 ? 420 : -420; // Scroll right if wheel down, left if wheel up
            
            scheduleBox.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }, { passive: false });
        
        // Initial setup
        updateButtonStates();
    }
});

// Add any other index-specific JavaScript here

// Render schedule cards from JSON
document.addEventListener('DOMContentLoaded', async function() {
    const scheduleBox = document.querySelector('.schedule-box');
    if (!scheduleBox) return;

    try {
        const response = await fetch('json/schedule.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load schedule.json');
        const data = await response.json();

        // Clear any existing static items
        scheduleBox.innerHTML = '';

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'schedule-item';

            // Format date to readable (e.g., Oct 4, 18:00)
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

            card.innerHTML = `
                <div class="sched-date">${dateStr}</div>
                <div class="sched-center">
                    <img class="team-logo" src="images/the_bandits_red.png" alt="The Bandits" />
                    <span class="sched-format">${item.format ?? ''}</span>
                    <img class="team-logo" src="images/team-logos/${item['opponent-image'] ?? ''}" alt="${item.opponent ?? 'Opponent'}" />
                </div>
                <div class="sched-footer">
                    <img class="sched-tournament" src="images/tournament-logos/${item.tournament ?? ''}" alt="${item.tournament ?? 'Tournament'}" />
                    <div class="sched-stage">${item.stage ?? ''}</div>
                </div>
            `;

            scheduleBox.appendChild(card);
        });
    } catch (err) {
        console.error(err);
    }
});
