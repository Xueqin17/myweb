<pre style={{ background: '#eee', padding: '1rem' }}>
{`
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]
`}
</pre>
