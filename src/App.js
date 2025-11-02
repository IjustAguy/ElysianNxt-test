import styled from '@emotion/styled'
import { Global, css } from '@emotion/react'
import { useState, useEffect } from 'react';

// --- Styles ---
const GlobalStyles = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', sans-serif;
        background-color: #f4f7f6;
        color: #333;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
    `}
  />
)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
`

const Title = styled.h1`
  color: #222;
  font-weight: 600;
`

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`

const ButtonDel = styled(Button)` 
  background-color: #dc3545; 
  padding: 8px 14px;
  font-size: 14px;
  align-self: flex-end; 
  margin-top: 10px;

  &:hover {
    background-color: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px; 
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
`

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
  }
`

const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 500px;
  margin-top: 30px;
`

const ResultCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
  padding: 20px;
  display: flex;
  flex-direction: column;
`

const UrlInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  word-break: break-all; 
`

const OriginalUrl = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  
  strong {
    color: #333;
    margin-right: 5px;
  }
`

const ShortLink = styled.a`
  margin: 0;
  font-size: 16px;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;

  strong {
    color: #333;
    margin-right: 5px;
  }

  &:hover {
    text-decoration: underline;
  }
`

// --- Component ---

export default function App() {

  const [url, setUrl] = useState("");
  const [urlList, setUrlList] = useState([]);

  async function shortenURL(url) {
    try {
      const res = await fetch("https://elysiannxt-test.onrender.com/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      return data.short;
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  }

  async function deleteURL(code) {
    try {
      await fetch(`https://elysiannxt-test.onrender.com/delete/${code}`, {
        method: "DELETE",
      });
    } catch (error)
    {
      console.error("Error deleting URL:", error);
    }
    setUrlList(urlList.filter((item) => item.code !== code));
  }

  const handdleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return; 
    const shortUrl = await shortenURL(url);
    if (shortUrl) {
      setUrlList([...urlList, { original: url, code: shortUrl.split('/').pop() }]);
    }
    setUrl("");
  }

  useEffect(() => {
    fetch("https://elysiannxt-test.onrender.com/list")
      .then((res) => res.json())
      .then((data) => setUrlList(data))
      .catch((err) => console.error("Error loading URLs:", err));
  }, []);

  return (
    <>
      <GlobalStyles /> 
      <Container>
        <Title>URL Shortener</Title>
        <Form onSubmit={handdleSubmit}>
          <Input
            type="url" 
            placeholder="Enter URL to shorten (e.g., https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required 
          />
          <Button type="submit">Shorten</Button>
        </Form>

        <ResultList>
          {urlList.map((item, index) => (
            <ResultCard key={index}>
              <UrlInfo>
                <OriginalUrl>
                  <strong>Original:</strong> {item.original}
                </OriginalUrl>
                <ShortLink 
                  href={`https://elysiannxt-test.onrender.com/${item.code}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <strong>Shortened:</strong> https://elysiannxt-test.onrender.com/{item.code}
                </ShortLink>
              </UrlInfo>
              <ButtonDel onClick={() => deleteURL(item.code)}>Delete</ButtonDel>
            </ResultCard>
          ))}
        </ResultList>
      </Container>
    </>
  )
}


