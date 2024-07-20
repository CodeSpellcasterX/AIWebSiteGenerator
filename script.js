document.getElementById('inputForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const promptText = document.getElementById('prompt').value.trim();

    try {
        const response = await fetch('API_END_POINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <API_KEY>'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: promptText
                    },
                ],
                model: "gpt-3.5-turbo",
                max_tokens: 512,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch HTML/CSS content');
        }
        
        const data = await response.json();
        console.log(data)
        // Assuming the API response structure is something like this:
        const htmlContent = data.choices[0].message.content;
        console.log(htmlContent, " before")
        const startIndex = htmlContent.indexOf('<!DOCTYPE html>');
        console.log(startIndex, " startIndex")
        const checkEndIndex = htmlContent.indexOf('</html>');
        let endIndex = checkEndIndex
        if(checkEndIndex == -1) {
            endIndex = htmlContent.length-1;
        }
        console.log(endIndex, " endIndex") - 1
        const actualContent = htmlContent.substring(startIndex, endIndex)
        console.log(actualContent, " after")
        const cssContent = extractCSSFromResponse(data); // Function to extract CSS content

        document.getElementById('htmlContent').innerHTML = actualContent;
        document.getElementById('cssContent').innerHTML = `<style>${cssContent}</style>`;
    } catch (error) {
        console.error('Error fetching HTML/CSS content:', error);
    }
});

function extractCSSFromResponse(apiResponse) {
    // Assume the CSS content is nested under 'css' key in the response JSON
    // Modify this based on how your API response actually looks like
    if (apiResponse.css) {
        return apiResponse.css.trim();
    } else {
        return '/* No CSS found */';
    }
}
