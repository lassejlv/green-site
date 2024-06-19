FROM oven/bun:latest as runtime

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN bun install --no-save

# Expose port 6969
EXPOSE 6969

# Run the app
CMD ["bun", "app.js"]