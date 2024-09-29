document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('lifeParameters');
  const sliders = form.querySelectorAll('input[type="range"]');
  const parameterLabels = [
    'Love', 'Wealth', 'Health', 'Intelligence', 'Creativity', 
    'Beauty', 'Social Acceptance', 'Adventure', 'Luck', 'Death Age'
  ];
  const progressBar = document.querySelector('.progress-bar');
  const totalPoints = 500;
  
  const remainingPointsDisplay = document.getElementById('remainingPoints');
  
  // Informational Message Box Elements
  const infoMessageBox = document.getElementById('infoMessage');
  const infoText = document.getElementById('infoText');
  const closeInfoButton = document.getElementById('closeInfoButton');
  
  // Analysis Summary Elements
  const analyzeButton = document.getElementById('analyzeButton');
  const submitSection = document.getElementById('submitSection');
  const analysisSummary = document.getElementById('analysisSummary');
  const summaryContent = document.getElementById('summaryContent');
  const shareButton = document.getElementById('shareButton');

  // Initialize Display Values
  updateValues();
  updateProgressBar();
  
  sliders.forEach((slider, index) => {
    slider.addEventListener('input', function() {
      let sum = 0;
      sliders.forEach((s) => {
        sum += parseInt(s.value);
      });
      
      if (sum > totalPoints) {
        // Calculate excess and adjust the current slider
        const excess = sum - totalPoints;
        this.value = parseInt(this.value) - excess;
        sum = totalPoints;
        updateValues();
        updateProgressBar();
        showExceedWarning();
      } else {
        updateValues();
        updateProgressBar();
      }
      
      // Update filled portion
      const value = this.value;
      this.style.setProperty('--value', `${value}%`);
      
      // Show informational message
      const label = parameterLabels[index];
      showInfoMessage(label, value);
    });
    
    // Optionally, show message on focus (for accessibility)
    slider.addEventListener('focus', function() {
      const label = parameterLabels[index];
      const value = this.value;
      showInfoMessage(label, value);
    });
  });

  function updateValues() {
    sliders.forEach((slider) => {
      let valueText = slider.value + "%";
      document.getElementById(slider.id + "Value").textContent = valueText;
    });
  }

  function updateProgressBar() {
    let sum = Array.from(sliders).reduce((acc, slider) => acc + parseInt(slider.value), 0);
    let remaining = totalPoints - sum;
    remainingPointsDisplay.textContent = remaining >=0 ? remaining : 0;
    
    let percentage = (sum / totalPoints) * 100;
    progressBar.style.width = `${percentage}%`;
    
    // Change progress bar color based on usage
    if (percentage > 100) {
      progressBar.classList.add('exceed');
    } else {
      progressBar.classList.remove('exceed');
      if (percentage > 80) {
        progressBar.style.backgroundColor = '#FFA500'; // Orange
      } else {
        progressBar.style.backgroundColor = '#FFD700'; // Gold
      }
    }
  }

  function showExceedWarning() {
    progressBar.classList.add('exceed');
    setTimeout(() => {
      progressBar.classList.remove('exceed');
    }, 1000);
  }

// Generate custom messages based on new percentage ranges with more depth and interest
function getParameterMessage(label, value) {
  let messages = [];

  if (value >= 0 && value <= 9) {
    messages = [
      `It seems like ${label} isn't a significant focus for you right now with just ${value}%. That's perfectly okay—this just reflects where your current priorities lie.`,
      `With ${value}% allocated to ${label}, it seems this area isn't taking much of your attention at the moment. You may feel it's less relevant to your immediate goals.`,
      `You’re not too concerned with ${label}, given the ${value}% priority. This shows you're focusing on other aspects of life that matter more to you.`
    ];
  } else if (value >= 10 && value <= 29) {
    messages = [
      `You’ve given ${label} some thought with a ${value}% priority. While it may not be at the forefront, it’s still present in your decision-making.`,
      `${label} comes in with ${value}%, indicating that it holds a place in your life, but perhaps isn't a driving factor in your current situation.`,
      `It looks like ${label} is on your radar with a ${value}% priority—something to keep in mind but not a pressing concern.`
    ];
  } else if (value >= 30 && value <= 49) {
    messages = [
      `You see ${label} as moderately important with ${value}%. It’s something you’re aware of but may not need immediate action.`,
      `With ${value}% priority, ${label} holds a decent place in your life. You're likely balancing this with other key priorities.`,
      `${label} is somewhat important to you at ${value}%. This suggests you may revisit it from time to time, but it doesn’t dominate your focus.`
    ];
  } else if (value >= 50 && value <= 69) {
    messages = [
      `You’ve placed a fair amount of emphasis on ${label} with ${value}%. It seems to be a significant part of your decision-making.`,
      `${label} carries a strong presence in your life at ${value}%. You're balancing this well with other priorities.`,
      `At ${value}%, ${label} seems to be an area you give careful attention to. You’re likely to act on it as opportunities or needs arise.`
    ];
  } else if (value >= 70 && value <= 89) {
    messages = [
      `${label} is clearly very important to you with ${value}%. It’s likely shaping many of your decisions and goals.`,
      `With ${value}% priority, ${label} stands out as a major focus for you. You’re probably dedicating time and resources to this area.`,
      `${label} takes a central role in your life at ${value}%. You're likely actively working on or planning around this aspect.`
    ];
  } else if (value >= 90 && value <= 100) {
    messages = [
      `${label} is a core part of your life with ${value}%. It seems to be one of your top priorities, guiding many of your actions and decisions.`,
      `At ${value}%, ${label} dominates your priorities. This shows just how crucial this area is to your personal or professional life.`,
      `With ${value}%, it’s clear that ${label} is an area you’re extremely invested in. You're likely driven by this and consistently focus on it.`
    ];
  }

  // Randomly select one message from the array
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}



// Mapping function for parameter values to categories
function mapValueToCategory(value) {
  if (value >= 0 && value <= 9) return 0;
  if (value >= 10 && value <= 29) return 1;
  if (value >= 30 && value <= 49) return 2;
  if (value >= 50 && value <= 69) return 3;
  if (value >= 70 && value <= 89) return 4;
  if (value >= 90 && value <= 100) return 5;
  
  // Optionally handle cases where the value is out of range
  return null; // or some other handling
}


  // Function to generate codes
  function generateCodes() {
    const values = Array.from(sliders).map(slider => parseInt(slider.value));
    const categories = values.map(mapValueToCategory); // Array of categories [1,2,3,...]
    
    // Create initial code string (e.g., "3333333333")
    const initialCode = categories.join('');
    
    // Group into pairs (e.g., ["33", "33", "33", "33", "33"])
    const pairedCodes = [];
    for (let i = 0; i < initialCode.length; i += 2) {
      const pair = initialCode.slice(i, i + 2);
      pairedCodes.push(pair);
    }
    
    // Function to map a pair to a character
    function mapPairToChar(pair) {
      const num = parseInt(pair);
      if (num >= 0 && num <= 25) {
        return String.fromCharCode(97 + num); // 'a' to 'z'
      } else if (num >= 26 && num <= 51) {
        return String.fromCharCode(65 + (num - 26)); // 'A' to 'Z'
      } else if (num >= 52 && num <= 55) {
        return (num - 52).toString(); // '0' to '3'
      } else {
        return '?'; // For any out-of-range values
      }
    }
    
    // Generate shortened code
    const shortenedCode = pairedCodes.map(mapPairToChar).join('');
    
    return { initialCode, shortenedCode };
  }

  // Display Informational Message Box
  function showInfoMessage(label, value) {
    const presence = value > 0 ? "presence" : "absence";
    const absence = value === 0 ? "absence" : "presence";
    
    let message = "";
    if (value > 30) {
      message = `Having ${label} significantly enhances your life by providing ${getEnhancement(label)}. Without it, you might experience ${getImpact(label)}.`;
    } else {
      message = `Lacking ${label} may lead to ${getImpact(label)}. Consider how ${label} can improve your life.`;
    }
    
    infoText.textContent = message;
    infoMessageBox.style.display = 'flex';
  }

  // Close Informational Message Box
  closeInfoButton.addEventListener('click', function() {
    infoMessageBox.style.display = 'none';
  });

  // Define how each parameter affects life
  function getEnhancement(label) {
    const enhancements = {
      'Love': 'emotional fulfillment and strong relationships',
      'Wealth': 'financial security and opportunities',
      'Health': 'physical well-being and energy',
      'Intelligence': 'problem-solving skills and adaptability',
      'Creativity': 'innovation and personal expression',
      'Beauty': 'self-confidence and social interactions',
      'Social Acceptance': 'sense of belonging and support',
      'Adventure': 'excitement and personal growth',
      'Luck': 'unexpected opportunities and favorable outcomes',
      'Death Age': 'perspective on life and legacy'
    };
    return enhancements[label] || 'various benefits';
  }

  function getImpact(label) {
    const impacts = {
      'Love': 'weaker emotional connections and loneliness',
      'Wealth': 'financial instability and limited opportunities',
      'Health': 'reduced energy and increased vulnerability to illness',
      'Intelligence': 'difficulty in adapting and solving problems',
      'Creativity': 'lack of innovation and personal expression',
      'Beauty': 'lower self-esteem and social challenges',
      'Social Acceptance': 'isolation and lack of support',
      'Adventure': 'stagnation and lack of personal growth',
      'Luck': 'fewer opportunities and challenges in navigating life',
      'Death Age': 'limited time to achieve goals and make an impact'
    };
    return impacts[label] || 'various challenges';
  }

  // Form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value || 'Anonymous';
    const age = document.getElementById('age').value || 'Unknown';

    // Collect parameter values
    const values = Array.from(sliders).map(slider => parseInt(slider.value));

    // Sort parameters based on values, excluding Death Age
    const sortedParameters = parameterLabels
      .map((label, index) => ({ label, value: values[index] }))
      .filter(param => param.label !== 'Death Age') // Exclude Death Age
      .sort((a, b) => b.value - a.value);

    // Extract highest and lowest rated parameters
    const [first, second, third] = sortedParameters.slice(0, 3);
    const leastImportant = sortedParameters[sortedParameters.length - 1];





    
    // Death Age value and special message
    const deathAgeValue = values[parameterLabels.indexOf('Death Age')];
    const deathAgeMessage = `You expect to live until ${deathAgeValue} years old. 🎉 Better make those years count!`;

    // Generate codes
    const { initialCode, shortenedCode } = generateCodes();

    // Email body content (Plain Text)
    let emailBody = `Before Life Response Sheet\n\n`;
    emailBody += `Hey, I am ${name}, and I am ${age} years old. These are my opinions about life.\n\n`;

    emailBody += `Life Priorities Summary:\n`;
    emailBody += `1. Most Important: ${first.label} (${first.value}%)\n`;
    emailBody += `2. Second Most Important: ${second.label} (${second.value}%)\n`;
    emailBody += `3. Third Most Important: ${third.label} (${third.value}%)\n`;
    emailBody += `4. Least Important: ${leastImportant.label} (${leastImportant.value}%)\n\n`;

    emailBody += `Detailed Life Area Breakdown:\n`;
    sortedParameters.forEach(param => {
      emailBody += `${param.label}: ${param.value}% - ${getParameterMessage(param.label, param.value)}\n`;
    });


    
    emailBody += `\n---\n`;
    emailBody += `Death Age:\n${deathAgeMessage}\n`;

    emailBody += `\n---\n`;

    emailBody += `Generated Codes:\n`;
    emailBody += `Initial Code: ${initialCode}\n`;
    emailBody += `Shortened Code: ${shortenedCode}\n\n`;

    emailBody += `---\n`;

    emailBody += `Copyable Data for Excel:\n`;
    emailBody += `Name, Age, ${parameterLabels.join(', ')}\n`;
    emailBody += `${name}, ${age}, ${values.join(', ')}\n\n`;

    // CSV Format (optional)
    let csvContent = `${parameterLabels.join(',')}\n${values.join(',')}`;

    // Email link with the body formatted as a plain text string
    window.location.href = `mailto:xchirxg@gmail.com?subject=Before Life Philosophy Response&body=${encodeURIComponent(emailBody)}`;
  });

  // Analyze Button
  analyzeButton.addEventListener('click', function() {
    generateAnalysisSummary();

    // Reveal Submit Button at the end of the page
    submitSection.style.display = 'block';
    // Scroll to Submit Section smoothly
    submitSection.scrollIntoView({ behavior: 'smooth' });
  });

  function generateAnalysisSummary() {
    const name = document.getElementById('name').value || 'Anonymous';
    const age = document.getElementById('age').value || 'Unknown';

    // Collect parameter values and map to categories
    const values = Array.from(sliders).map(slider => parseInt(slider.value));
    const categories = values.map(mapValueToCategory); // Array of categories [1,2,3,...]

    // Sort parameters based on values, excluding Death Age
    const sortedParameters = parameterLabels
      .map((label, index) => ({ label, value: values[index] }))
      .filter(param => param.label !== 'Death Age') // Exclude Death Age
      .sort((a, b) => b.value - a.value);

    // Extract highest and lowest rated parameters
    const [first, second, third] = sortedParameters.slice(0, 3);
    const leastImportant = sortedParameters[sortedParameters.length - 1];

    // Death Age value and special message
    const deathAgeValue = values[parameterLabels.indexOf('Death Age')];
    const deathAgeMessage = `You expect to live until ${deathAgeValue} years old. 🎉 Better make those years count!`;

    // Generate codes
    const { initialCode, shortenedCode } = generateCodes();

    // Populate Analysis Summary
    let summaryHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Age:</strong> ${age}</p>
      <h3>Life Priorities Summary:</h3>
      <ul>
        <li><strong>Most Important:</strong> ${first.label} (${first.value}%)</li>
        <li><strong>Second Most Important:</strong> ${second.label} (${second.value}%)</li>
        <li><strong>Third Most Important:</strong> ${third.label} (${third.value}%)</li>
        <li><strong>Least Important:</strong> ${leastImportant.label} (${leastImportant.value}%)</li>
      </ul>
      <h3>Detailed Life Area Breakdown:</h3>
      

      <ul>
    `;


// Add detailed analysis for each parameter
sortedParameters.forEach(param => {
  let detailedAnalysis = '';

  switch (param.label.toLowerCase()) {
    case "love":
      detailedAnalysis = getLoveAnalysis(param.value);
      break;
    case "wealth":
      detailedAnalysis = getWealthAnalysis(param.value);
      break;
    case "health":
      detailedAnalysis = getHealthAnalysis(param.value);
      break;
    case "intelligence":
      detailedAnalysis = getIntelligenceAnalysis(param.value);
      break;
    case "creativity":
      detailedAnalysis = getCreativityAnalysis(param.value);
      break;
    case "beauty":
      detailedAnalysis = getBeautyAnalysis(param.value);
      break;
    case "social acceptance":
      detailedAnalysis = getSocialAcceptanceAnalysis(param.value);
      break;
    case "adventure":
      detailedAnalysis = getAdventureAnalysis(param.value);
      break;
    case "luck":
      detailedAnalysis = getLuckAnalysis(param.value);
      break;
    case "death age":
      detailedAnalysis = getDeathAgeAnalysis(param.value);
      break;
    default:
      detailedAnalysis = getParameterMessage(param.label, param.value);
  }

  summaryHTML += `<li>${param.label}: ${param.value}% - ${detailedAnalysis}</li>`;
});



    summaryHTML += `
      </ul>
      <h3>Death Age:</h3>
      <p>${deathAgeMessage}</p>
      <h3>Generated Codes:</h3>
      
      <p><strong>BLPhi Code:</strong> ${shortenedCode}</p>
    `;

    summaryContent.innerHTML = summaryHTML;
    analysisSummary.style.display = 'block'; // Show analysis summary
  }



  
  // Share Button Functionality
  shareButton.addEventListener('click', function() {
    // Generate codes to include in sharing
    const { shortenedCode } = generateCodes();
    
    const shareURL = window.location.href;

    // Example preferences based on top and least important parameters
    const topPreferences = [
      sortedParameters[0]?.label || 'Parameter1',
      sortedParameters[1]?.label || 'Parameter2',
      sortedParameters[2]?.label || 'Parameter3'
    ];
    const leastFavorite = sortedParameters[sortedParameters.length - 1]?.label || 'Parameter10';
    
    const shareText = encodeURIComponent(`I've taken the Before Life Philosophy test! Here are my top 3 priorities in life: ${topPreferences.join(', ')} and my least favorite: ${leastFavorite}. My code: ${shortenedCode}. What about you? Take the test and find out!`);

    // Sharing URLs
    const twitterURL = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareURL)}`;
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`;
    const whatsappURL = `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareURL)}`;
    const telegramURL = `https://t.me/share/url?url=${encodeURIComponent(shareURL)}&text=${shareText}`;
    const gmailURL = `mailto:?subject=Check%20out%20this%20test!&body=${shareText}%20${encodeURIComponent(shareURL)}`;
    const discordURL = `https://discord.com/share?url=${encodeURIComponent(shareURL)}&text=${shareText}`;
    const redditURL = `https://www.reddit.com/submit?url=${encodeURIComponent(shareURL)}&title=${shareText}`;

    // Create a popup window for sharing
    const popup = window.open('', 'Share', 'width=600,height=600');
    popup.document.write(`
        <html>
            <head><title>Share Your Results</title></head>
            <body style="background-color: #1a1a1a; color: #fff; font-family: 'Raleway', sans-serif; text-align: center; padding: 50px;">
                <h2>Share Your Before Life Philosophy Results</h2>
                <p>I've taken the Before Life Philosophy test! Here are my top 3 priorities in life: ${topPreferences.join(', ')} and my least favorite: ${leastFavorite}. My code: ${shortenedCode}. What about you? 🤔</p>
                <p>Encourage your friends to take the test too!</p>
                <p style="font-weight: bold;">Choose a platform to share:</p>
                <a href="${twitterURL}" target="_blank" style="margin: 20px; padding: 10px 20px; background-color: #1DA1F2; color: #fff; text-decoration: none; border-radius: 50px;">Twitter</a><br><hr>
                <a href="${facebookURL}" target="_blank" style="margin: 20px; padding: 10px 20px; background-color: #3b5998; color: #fff; text-decoration: none; border-radius: 50px;">Facebook</a><br><hr>
                <a href="${whatsappURL}" target="_blank" style="margin: 20px; padding: 10px 20px; background-color: #25D366; color: #fff; text-decoration: none; border-radius: 50px;">WhatsApp</a><br><hr>
                <a href="${telegramURL}" target="_blank" style="margin: 20px; padding: 10px 20px; background-color: #0088cc; color: #fff; text-decoration: none; border-radius: 50px;">Telegram</a><br><hr>
                <a href="${gmailURL}" target="_blank" style="margin: 20px; padding: 10px 20px; background-color: #D44638; color: #fff; text-decoration: none; border-radius: 50px;">Gmail</a><br><hr>
                <a href="${discordURL}" target="_blank" style="margin: 20px; padding: 10px 20px; background-color: #7289DA; color: #fff; text-decoration: none; border-radius: 50px;">Discord</a><br><hr>
                <a href="${redditURL}" target="_blank" style="margin: 20px; padding: 10px 20px; background-color: #FF4500; color: #fff; text-decoration: none; border-radius: 50px;">Reddit</a><br><hr>
                <br><br>
                <p style="font-weight: bold;">🔗 Visit: <a href="${shareURL}" style="color: #FFD700;">${shareURL}</a></p>
                <button onclick="window.close()" style="padding: 10px 20px; background-color: #FFD700; border: none; border-radius: 5px; cursor: pointer;">Close</button>
            </body>
        </html>
    `);
  });

  // Data Persistence (Optional Enhancement)
  // Save data on input
  form.addEventListener('input', function() {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    localStorage.setItem('lifeParameters', JSON.stringify(data));
    updateValues();
    updateProgressBar();
  });

  // Load data on page load
  const savedData = JSON.parse(localStorage.getItem('lifeParameters'));
  if (savedData) {
    sliders.forEach((slider) => {
      if (savedData[slider.id]) {
        slider.value = savedData[slider.id];
        slider.style.setProperty('--value', `${savedData[slider.id]}%`);
      }
    });
    updateValues();
    updateProgressBar();
  }
  
  // Info Message Box and Question Mark interactions
  const infoMessage = document.getElementById('infoMessage');
  const closeButton = document.getElementById('closeInfoButton');
  const questionMark = document.getElementById('questionMark');

  // Function to show the message
  function showMessage() {
      infoMessage.style.display = 'flex'; // Show the message
  }

  // Function to hide the message
  function hideMessage() {
      infoMessage.style.display = 'none'; // Hide the message
  }

  // Close button event listener
  closeButton.addEventListener('click', function() {
      hideMessage(); // Hide message on close
  });

  // Question mark event listener
  questionMark.addEventListener('click', function() {
      showMessage(); // Show message when question mark is clicked
  });

  // Add event listeners to the sliders or parameters
  const parameters = document.querySelectorAll('.parameter input[type="range"]');
  parameters.forEach(parameter => {
      parameter.addEventListener('input', function() {
          // Handle parameter change here
          hideMessage(); // Keep the message hidden when changing parameters
      });
  });
});




// Generate detailed analysis based on percentage ranges for "Love"
function getLoveAnalysis(value) {
  let analysis = '';

  if (value >= 0 && value <= 9) {
    analysis = `💔 It seems love isn't a major focus for you right now, with only ${value}%. While you may be prioritizing other aspects of life, consider that love can bring profound joy and connection. Even small gestures of affection can ignite positive feelings. Perhaps now is a good time to reflect on how you can incorporate more love into your life, no matter how small the steps.`;
  } else if (value >= 10 && value <= 29) {
    analysis = `🌼 You've allocated ${value}% to love, which suggests it's a budding area in your life. You might be open to connections but are currently focused on personal growth or career ambitions. This is a great opportunity to explore deeper relationships at your own pace. Remember, every love story begins with a single step, so keep your heart open and cherish the moments of connection that come your way!`;
  } else if (value >= 30 && value <= 49) {
    analysis = `💖 With ${value}% on love, you exhibit a balanced view towards relationships. You recognize the importance of love but understand that it’s one of many facets in your life. This is an ideal time to nurture your current relationships and explore new ones. Love is about connection; don't hesitate to reach out and deepen bonds with those around you. Your capacity for love is growing, and with it, so are your opportunities for joy!`;
  } else if (value >= 50 && value <= 69) {
    analysis = `💕 Love holds a significant place in your heart at ${value}%. You're likely to feel its presence shaping your happiness and life decisions. Embrace this energy, as it can guide you toward fulfilling relationships. Remember to communicate openly and express your feelings—doing so can strengthen your connections. It's a time to enjoy love in all its forms, from friendships to romantic pursuits, as these relationships are essential to your overall well-being!`;
  } else if (value >= 70 && value <= 89) {
    analysis = `💞 With a strong ${value}% priority on love, it’s clear that relationships are a cornerstone of your happiness. You're likely surrounded by meaningful connections, and this positive energy can significantly enhance your quality of life. Keep investing in these relationships, as they bring you joy and fulfillment. However, be mindful of balance; ensure you are also nurturing your personal aspirations, so your love life continues to flourish alongside your individual growth!`;
  } else if (value >= 90 && value <= 100) {
    analysis = `❤️ Love is the core of your being, rated at an impressive ${value}%. Your relationships likely bring immense joy and purpose to your life. You possess a deep emotional awareness that allows you to connect profoundly with others. While this is beautiful, ensure to maintain a balance with your own needs and ambitions. As you cherish these connections, also remember to nurture yourself, allowing both love and personal growth to thrive harmoniously.`;
  }

  return analysis;
}


// Generate detailed analysis based on percentage ranges for "Wealth"
function getWealthAnalysis(value) {
  let analysis = '';

  if (value >= 0 && value <= 9) {
    analysis = `💸 Wealth isn't a primary focus for you right now, with only ${value}%. While financial abundance can provide security, it's essential to recognize that wealth comes in many forms, including experiences and relationships. Consider exploring how small investments in your passions or personal development can bring you richness in ways beyond money. Your current priority allows you to appreciate the non-material joys in life!`;
  } else if (value >= 10 && value <= 29) {
    analysis = `📉 You've designated ${value}% to wealth, indicating that financial matters are a secondary consideration at this stage. This could be a time to invest in your skills or passions that might not yield immediate financial returns. Remember, building a secure financial future often starts with personal growth. Reflect on how you can create value in your life that transcends monetary wealth—those experiences can be invaluable!`;
  } else if (value >= 30 && value <= 49) {
    analysis = `💰 With ${value}% allocated to wealth, you're beginning to acknowledge the importance of financial security alongside other life aspects. This balance is commendable, as it allows you to pursue passions without feeling financially stressed. Consider setting short-term financial goals that align with your broader life objectives. Each step you take towards financial well-being enhances your overall quality of life, and you're on the right path!`;
  } else if (value >= 50 && value <= 69) {
    analysis = `💵 Wealth plays a significant role in your life at ${value}%. You understand that financial stability is key to achieving your goals and enjoying your passions. This is a good time to evaluate your financial strategies and consider investments that resonate with your values. Remember, wealth isn’t just about accumulation; it’s also about how you use those resources to create a fulfilling life. Nurture your financial growth while staying true to your aspirations!`;
  } else if (value >= 70 && value <= 89) {
    analysis = `💎 You’ve placed a strong emphasis on wealth with a noteworthy ${value}%. This indicates a proactive approach to financial matters, which can lead to substantial rewards in your future. Keep focusing on building your assets and consider diversifying your income streams. However, as you pursue financial success, ensure you’re also investing in your emotional and social well-being. Balancing these aspects will create a holistic sense of fulfillment in your life!`;
  } else if (value >= 90 && value <= 100) {
    analysis = `💼 Wealth is a central theme in your life, rated at an impressive ${value}%. Your focus on financial abundance reflects a deep understanding of its role in achieving your dreams. This is a great time to explore new investment opportunities and strategies that align with your goals. However, as you climb the financial ladder, remember to give back and create value for others. Acknowledging the wealth you share can enrich your life in ways that money alone cannot!`;
  }

  return analysis;
}


// Generate detailed analysis based on percentage ranges for "Health"
function getHealthAnalysis(value) {
  let analysis = '';

  if (value >= 0 && value <= 9) {
    analysis = `🏥 Health isn't a primary focus for you right now, with only ${value}%. While it’s completely valid to prioritize other aspects of life, consider this: neglecting your health can have long-term consequences. Reflect on small, manageable changes you can make in your daily routine to foster better well-being. Remember, investing in your health today paves the way for a more vibrant tomorrow!`;
  } else if (value >= 10 && value <= 29) {
    analysis = `🥗 You’ve allocated ${value}% to health, which indicates it’s a secondary priority for you. This phase might be a time of exploration, but don’t forget that even minor improvements can have a significant impact. Think about incorporating simple habits, like walking more or choosing nutritious snacks, into your routine. These small steps can lead to substantial changes over time, enhancing your overall well-being!`;
  } else if (value >= 30 && value <= 49) {
    analysis = `💪 With ${value}% dedicated to health, you recognize its importance but still balance it with other life areas. This is a great opportunity to develop a structured plan that enhances your physical and mental health. Setting specific, achievable health goals can motivate you. Remember, consistency is key! Your commitment to well-being will empower you to enjoy life to the fullest, making every moment count!`;
  } else if (value >= 50 && value <= 69) {
    analysis = `🌟 Health plays a significant role in your life at ${value}%. Your awareness of its importance reflects a balanced approach to living well. Consider diving deeper into your health journey—explore activities that promote both physical and mental wellness, such as yoga or meditation. By investing time in your health, you're not just prolonging your life but enriching it. Nurturing your body and mind will yield countless rewards!`;
  } else if (value >= 70 && value <= 89) {
    analysis = `🏋️ You’ve placed a strong emphasis on health with an impressive ${value}%. This indicates a proactive stance toward your physical and mental well-being. Continue to explore diverse ways to enhance your health, whether through exercise, nutrition, or self-care practices. However, remember to listen to your body and mind; even high achievers need rest and recovery. Striking this balance will ensure you thrive in all aspects of life!`;
  } else if (value >= 90 && value <= 100) {
    analysis = `🌈 Health is a central theme in your life, rated at an exceptional ${value}%. Your commitment to well-being speaks volumes about your understanding of its impact on every aspect of your life. This is an excellent time to refine your health routines and possibly mentor others in their journeys. However, as you focus on health, ensure you're nurturing your emotional and social wellness as well. A well-rounded approach will lead to a fulfilling and vibrant life!`;
  }

  return analysis;
}


// Generate detailed analysis based on percentage ranges for "Intelligence"
function getIntelligenceAnalysis(value) {
  let analysis = '';

  if (value >= 0 && value <= 9) {
    analysis = `🧠 Intelligence isn’t currently a top priority for you, sitting at just ${value}%. It’s perfectly fine to focus your energy elsewhere right now! However, consider that intellectual curiosity can enhance your life in many ways. Perhaps explore new topics or hobbies that spark your interest. A little bit of learning each day can open doors you never imagined!`;
  } else if (value >= 10 && value <= 29) {
    analysis = `📚 With ${value}% allocated to intelligence, it seems you have a moderate interest in intellectual pursuits. While other areas may take precedence, there’s a wealth of knowledge waiting to be explored. Challenge yourself to read a book or take an online course! Engaging your mind will not only enrich your life but may also lead to unexpected opportunities!`;
  } else if (value >= 30 && value <= 49) {
    analysis = `🔍 At ${value}%, intelligence plays a notable role in your life. You appreciate the value of knowledge and the power it holds. This is a great time to dive deeper into your interests! Consider joining discussion groups or workshops. Embrace your curiosity, and don't hesitate to explore new ideas—each step will help expand your intellectual horizons!`;
  } else if (value >= 50 && value <= 69) {
    analysis = `💡 With ${value}% of your focus on intelligence, you clearly recognize its significance. This balance reflects a healthy blend of intellect and life experiences. Explore challenging subjects, engage in critical thinking, and share ideas with others. Your intellectual pursuits can be a source of great joy, leading to personal growth and enhanced creativity in your daily life!`;
  } else if (value >= 70 && value <= 89) {
    analysis = `🌟 Intelligence is a key aspect of your life, rated at an impressive ${value}%. You’re likely someone who thrives on knowledge and loves to learn. This is a wonderful time to harness your intellectual energy and perhaps mentor others. Just remember to balance your thirst for knowledge with practical applications; translating ideas into action will make your insights even more impactful!`;
  } else if (value >= 90 && value <= 100) {
    analysis = `🧬 Your commitment to intelligence is remarkable, with a phenomenal ${value}%. You understand the profound influence of knowledge on your life. This is a perfect opportunity to lead discussions or contribute to your community through educational initiatives. However, as you pursue intellectual excellence, don't forget to cultivate emotional intelligence too; a well-rounded approach will lead to deeper connections and understanding!`;
  }

  return analysis;
}


// Generate detailed analysis based on percentage ranges for "Creativity"
function getCreativityAnalysis(value) {
  let analysis = '';

  if (value >= 0 && value <= 9) {
    analysis = `🎨 Creativity isn’t currently a major focus for you, resting at just ${value}%. That’s completely okay! Sometimes, life calls for practicality over imagination. However, consider allowing yourself moments of free expression—whether through doodling, writing, or even daydreaming. You might discover hidden talents waiting to be explored!`;
  } else if (value >= 10 && value <= 29) {
    analysis = `🖌️ At ${value}%, creativity has a modest presence in your life. While it may not dominate your priorities, nurturing your creative side can lead to fresh perspectives! Try setting aside a little time each week for creative activities—painting, crafting, or even cooking. You’ll be surprised at how such activities can enhance your problem-solving skills!`;
  } else if (value >= 30 && value <= 49) {
    analysis = `🌈 With creativity rated at ${value}%, you appreciate its importance in enriching your experiences. This is a fantastic time to dive deeper into creative projects! Consider exploring new artistic forms or collaborating with others. Your ideas can blossom when shared! Remember, creativity is not just an outlet; it can also be a source of profound joy and fulfillment!`;
  } else if (value >= 50 && value <= 69) {
    analysis = `✨ Creativity is a significant aspect of your life, valued at ${value}%. You likely find inspiration in everyday moments and are unafraid to express yourself. This is the perfect moment to challenge your boundaries! Try experimenting with new mediums or styles—don’t shy away from pushing your creative limits. Every effort you make will only enhance your artistic journey!`;
  } else if (value >= 70 && value <= 89) {
    analysis = `🌟 Your commitment to creativity is evident, with an impressive ${value}%. You thrive in environments that encourage innovation and self-expression! Now is a great time to take on ambitious projects or explore leadership roles in creative endeavors. Just remember to allow for moments of introspection—sometimes, the best ideas come when you give yourself space to think!`;
  } else if (value >= 90 && value <= 100) {
    analysis = `🌠 Your passion for creativity is truly remarkable, rated at a phenomenal ${value}%. You live and breathe innovation, often serving as an inspiration to those around you! Continue to cultivate your imaginative spirit by seeking out collaborative opportunities or teaching others what you know. Your unique vision can change perspectives and make a lasting impact on your community!`;
  }

  return analysis;
}


// Generate detailed analysis based on percentage ranges for "Beauty"
function getBeautyAnalysis(value) {
  let analysis = '';

  if (value >= 0 && value <= 9) {
    analysis = `🌼 Beauty isn't a top priority for you right now, with a score of just ${value}%. That's perfectly fine! Life often revolves around more pressing matters. However, consider taking a moment to appreciate the beauty around you—whether it’s a sunrise, a piece of art, or a smile from a friend. Small acknowledgments can uplift your spirit and enhance your overall outlook!`;
  } else if (value >= 10 && value <= 29) {
    analysis = `🌸 With beauty holding a moderate ${value}%, you recognize its value but may not prioritize it. Embracing beauty in small doses can be refreshing! Try curating your environment with items that bring you joy, like flowers, art, or even a cozy corner. This can help you cultivate a sense of peace and inspiration in your daily life!`;
  } else if (value >= 30 && value <= 49) {
    analysis = `🌺 Beauty plays a significant role in your life, valued at ${value}%. You appreciate aesthetic experiences and seek to create beauty in your surroundings. Now is a wonderful time to immerse yourself in beauty—consider visiting galleries, exploring nature, or even engaging in creative projects that resonate with your idea of beauty. Your appreciation can transform ordinary moments into extraordinary ones!`;
  } else if (value >= 50 && value <= 69) {
    analysis = `🌷 Your appreciation for beauty is evident at ${value}%. You understand how beauty can enhance your life and uplift your spirit. This is a fantastic time to express your own sense of beauty through personal style or home decor! Remember, beauty can also come from within—embrace practices that promote self-love and confidence, allowing your inner beauty to shine through!`;
  } else if (value >= 70 && value <= 89) {
    analysis = `🌹 Your strong affinity for beauty is clear, rated at ${value}%. You likely find joy in aesthetics and seek beauty in every aspect of life! Consider sharing your passion with others—perhaps by creating art, hosting events, or simply spreading positivity. Your ability to see and cultivate beauty can inspire those around you, making the world a more vibrant place!`;
  } else if (value >= 90 && value <= 100) {
    analysis = `🌺 Your love for beauty is truly exceptional, scoring an impressive ${value}%. You are a beacon of beauty in your community, likely inspiring others to appreciate and create beauty as well. Continue to cultivate this passion! Engage in projects that celebrate beauty, whether through art, fashion, or personal endeavors. Your unique perspective can transform lives and bring joy to many!`;
  }

  return analysis;
}


// Generate detailed analysis based on percentage ranges for "Social Acceptance"
function getSocialAcceptanceAnalysis(value) {
  let analysis = '';

  if (value >= 0 && value <= 9) {
    analysis = `🤔 Social acceptance is not a major focus for you at this time, with a score of just ${value}%. That's absolutely okay! You may prioritize your individuality and personal beliefs over fitting in. Embrace your uniqueness; it’s what sets you apart! Remember, true acceptance comes from being authentic and true to yourself.`;
  } else if (value >= 10 && value <= 29) {
    analysis = `🌱 You place some importance on social acceptance, scoring ${value}%. While you may not be overly concerned, you recognize its role in fostering connections. Consider engaging with social groups that resonate with your interests. Building relationships with like-minded individuals can enhance your sense of belonging while staying true to your core values!`;
  } else if (value >= 30 && value <= 49) {
    analysis = `🌼 With a value of ${value}%, social acceptance matters to you. You appreciate community and connection, but you also value your individuality. Strive to find a balance between fitting in and standing out. Remember, it's possible to honor your uniqueness while also enjoying social interactions. Seek spaces where you can express both your authentic self and connect with others!`;
  } else if (value >= 50 && value <= 69) {
    analysis = `🌈 Your appreciation for social acceptance is significant, rated at ${value}%. You thrive on connections and enjoy feeling accepted by those around you. This is a great time to nurture your social relationships! Consider joining clubs or activities that align with your passions. Your ability to foster connections can enhance your sense of community and belonging!`;
  } else if (value >= 70 && value <= 89) {
    analysis = `🤝 Social acceptance is a key aspect of your life, with a strong score of ${value}%. You understand the importance of belonging and likely seek out environments where you feel valued. Use this strength to build meaningful relationships and create inclusive spaces for others! Your passion for connection can have a positive impact on those around you, fostering a supportive community!`;
  } else if (value >= 90 && value <= 100) {
    analysis = `🌟 Your desire for social acceptance is exceptional, scoring an impressive ${value}%. You are a natural at creating bonds and fostering a sense of community! Your charisma draws people in, and your ability to make others feel accepted is a true gift. Continue to share this warmth and openness, as it can transform lives and inspire those around you to embrace their authentic selves!`;
  }

  return analysis;
}
// Generate detailed analysis based on percentage ranges for "Adventure"
function getAdventureAnalysis(value) {
  let analysis = '';

  if (value >= 0 && value <= 9) {
    analysis = `🧘 Adventure isn't a top priority for you right now, with a score of just ${value}%. You may find comfort in routine and stability, valuing the safety of familiar surroundings. Remember, there's nothing wrong with enjoying the simple pleasures of life. Every journey begins with small steps, and you can always seek new experiences at your own pace!`;
  } else if (value >= 10 && value <= 29) {
    analysis = `🌍 You show some interest in adventure, scoring ${value}%. While exploration may not dominate your life, you occasionally crave new experiences. Consider stepping out of your comfort zone once in a while; even small adventures can lead to memorable moments! Embrace spontaneity when it feels right; life has so much to offer!`;
  } else if (value >= 30 && value <= 49) {
    analysis = `🚀 Adventure plays a moderate role in your life, with a value of ${value}%. You appreciate exploring new places and trying new things, but balance it with your other commitments. Allow yourself to seek out adventures that excite you—whether that's a weekend getaway or a new hobby. Life is about experiences, and you have a unique journey waiting for you!`;
  } else if (value >= 50 && value <= 69) {
    analysis = `🏞️ Your adventurous spirit shines through with a score of ${value}%. You thrive on new experiences and often seek out opportunities to explore the unknown. Embrace this passion! Whether it's traveling to a new destination or trying an exhilarating activity, your willingness to take risks can lead to personal growth and incredible stories to share!`;
  } else if (value >= 70 && value <= 89) {
    analysis = `🌟 Adventure is a significant part of your life, rated at ${value}%. You likely seek excitement and thrive in dynamic environments. Your zest for life inspires those around you! Keep pushing your limits and explore the world—your adventurous nature is a gift that can lead to unforgettable memories and transformative experiences. Don't be afraid to dream big!`;
  } else if (value >= 90 && value <= 100) {
    analysis = `🔥 Your passion for adventure is outstanding, scoring an incredible ${value}%. You are a true explorer at heart, constantly seeking thrills and new horizons. Your adventurous spirit not only enriches your life but also inspires others to embrace their own journeys! Keep following your heart and seeking out new experiences. The world is your playground, and there are endless adventures waiting for you!`;
  }

  return analysis;
}
// Generate detailed analysis based on percentage ranges for "Luck"
function getLuckAnalysis(value) {
  let analysis = '';

  if (value >= 0 && value <= 9) {
    analysis = `🍀 Luck isn't a major factor in your life right now, with a score of just ${value}%. You might believe that success is primarily the result of hard work and determination. While this mindset is admirable, remember that even the smallest strokes of luck can bring unexpected opportunities. Stay open to the possibilities around you, as fortune can sometimes favor the bold!`;
  } else if (value >= 10 && value <= 29) {
    analysis = `✨ You view luck as a minor influence in your life, scoring ${value}%. While you recognize its existence, you may prefer to rely on your own efforts. Embrace this pragmatic approach, but also allow yourself to acknowledge those serendipitous moments that can lead to new paths. Keep your eyes peeled for opportunities that may arise unexpectedly—they can be the little blessings that enhance your journey!`;
  } else if (value >= 30 && value <= 49) {
    analysis = `🌠 Luck plays a moderate role in your life, with a value of ${value}%. You appreciate the balance between hard work and fortunate circumstances. You understand that while you can shape your destiny, the universe sometimes provides delightful surprises. Stay open-minded and receptive to chance encounters; they can lead to rewarding experiences that you might not have anticipated!`;
  } else if (value >= 50 && value <= 69) {
    analysis = `🌈 You recognize luck as a significant aspect of your life, rated at ${value}%. You often feel that fortune smiles upon you, complementing your efforts with unexpected advantages. This perspective can boost your confidence and encourage you to take calculated risks. Embrace your fortunate streak, but also remember that maintaining a positive outlook can attract even more good luck into your life!`;
  } else if (value >= 70 && value <= 89) {
    analysis = `🍀 Luck is a major theme in your life, scoring an impressive ${value}%. You likely have a strong belief in serendipity and may have experienced several lucky breaks that have shaped your path. This optimistic view can inspire others and create a vibrant atmosphere around you. Trust in your good fortune, but also continue to work hard and make the most of the opportunities that come your way!`;
  } else if (value >= 90 && value <= 100) {
    analysis = `🏆 Your belief in luck is exceptional, with a phenomenal score of ${value}%. You see luck as a driving force in your life, guiding you toward extraordinary opportunities. This strong connection to luck suggests that you may be in tune with the universe, and your positivity likely attracts even more good fortune. Keep embracing your lucky nature—your life is a testament to the magic of believing in possibilities!`;
  }

  return analysis;
}


// Generate detailed analysis based on percentage ranges for "Death Age"
function getDeathAgeAnalysis(value) {
  let analysis = '';

  if (value >= 0 && value <= 9) {
    analysis = `🕰️ The low score of ${value}% indicates that thoughts of mortality and the end of life are not prominent in your mind. You may focus on living in the moment, cherishing every experience without dwelling on the inevitable. This outlook can lead to a fulfilling life, as you embrace each day as a gift. Remember, every moment counts—make the most of your time!`;
  } else if (value >= 10 && value <= 29) {
    analysis = `🌅 With a score of ${value}%, you hold a somewhat distant view of death. You recognize it as a natural part of life, but your focus is on the present and the experiences that bring you joy. This balanced perspective allows you to appreciate life without fear. Reflect on the legacy you want to leave behind, as it's never too early to think about how you can impact others positively!`;
  } else if (value >= 30 && value <= 49) {
    analysis = `🌿 Scoring ${value}%, you have a moderate awareness of death and its significance in life. You understand that life is finite, which can motivate you to pursue your passions and dreams. This awareness fosters a deeper appreciation for the people and moments that matter. Embrace this perspective as a source of inspiration to live fully and authentically!`;
  } else if (value >= 50 && value <= 69) {
    analysis = `🕊️ Your score of ${value}% suggests that you contemplate death fairly often. This awareness can lead to a deeper understanding of your values and priorities. While it’s natural to reflect on mortality, use this insight to focus on creating meaningful connections and experiences. Life is about balance—find joy in the now while also contemplating the legacy you wish to leave!`;
  } else if (value >= 70 && value <= 89) {
    analysis = `💭 With a high score of ${value}%, you have a keen awareness of mortality, possibly viewing it as a significant motivator in your life. This perspective can drive you to live with intention and purpose, ensuring that your time is well spent. However, while it’s important to consider your legacy, remember to enjoy the journey—life is as much about the process as it is about the destination!`;
  } else if (value >= 90 && value <= 100) {
    analysis = `🌌 Scoring a remarkable ${value}%, you have a profound awareness of death that shapes your outlook on life. You might often think about what it means to truly live and how you can leave a lasting impact. This reflection can be empowering, urging you to create a meaningful legacy. Embrace your insights and use them to inspire yourself and others to live fully and passionately!`;
  }

  return analysis;
}
