// Mapping BLPhi code to parameters
const parameterNames = ["Love", "Wealth", "Health", "Intelligence", "Creativity", "Beauty", "Social Acceptance", "Adventure", "Luck", "Death Age"];

// Function to decode a single character of BLPhi code to parameters (love, wealth, etc.)
function decodeBLPhiChar(char) {
    const value = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(char);
    const firstParam = Math.floor(value / 6) + 1;
    const secondParam = (value % 6) + 1;
    return [firstParam, secondParam];
}

// Function to decode the entire BLPhi code
function decodeBLPhiCode(code) {
    let parameters = [];
    for (let i = 0; i < code.length; i++) {
        parameters.push(...decodeBLPhiChar(code[i]));
    }
    return parameters;
}

// Function to get the top 3 and lowest parameter (excluding Death Age)
function getTopThree(parameters) {
    let result = [];
    const withoutDeathAge = parameters.slice(0, 9);
    const sorted = [...withoutDeathAge].map((param, index) => ({ param, index }))
                                       .sort((a, b) => b.param - a.param);

    const topThree = sorted.slice(0, 3).map(item => parameterNames[item.index]);
    const lastOne = parameterNames[sorted[sorted.length - 1].index];

    return { topThree, lastOne };
}

// Function to compare multiple BLPhi codes
function compareBLPhiCodes() {
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    let userData = [];
    for (let i = 1; i <= 5; i++) {
        let codeInput = document.getElementById('code' + i).value;
        let nameInput = document.getElementById('name' + i).value || `User ${i}`;
        if (codeInput) {
            let decodedParams = decodeBLPhiCode(codeInput);
            let { topThree, lastOne } = getTopThree(decodedParams);
            userData.push({ name: nameInput, code: codeInput, topThree, lastOne });
        }
    }

    // Display the comparison result
    if (userData.length > 0) {
        resultDiv.innerHTML = `<h2>Comparison Results</h2>`;
        userData.forEach(user => {
            resultDiv.innerHTML += `
                <div>
                    <h3>${user.name} (BLPhi Code: ${user.code})</h3>
                    <p>Top Parameters: ${user.topThree.join(", ")}</p>
                    <p>Lowest Parameter : ${user.lastOne}</p>
                </div>
            `;
        });
    } else {
        resultDiv.innerHTML = `<p>Please enter at least one BLPhi code.</p>`;
    }
}
