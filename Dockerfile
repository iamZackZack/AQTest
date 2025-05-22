# Start from rocker with R 4.3.2
FROM rocker/r-base:4.3.2

# Install system packages
RUN apt-get update && apt-get install -y \
    sudo \
    git \
    curl \
    build-essential \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    python3 \
    python3-pip \
    nodejs \
    npm

# Install R packages
RUN R -e "install.packages(c('mirt', 'jsonlite'), repos='https://cloud.r-project.org')"

# Install Python packages
RUN pip3 install --break-system-packages pandas matplotlib PyMuPDF

# Set working directory
WORKDIR /app

# Copy server and essential files
COPY backend/server.js /app/server.js

# Copy folders
COPY backend/routes /app/routes
COPY backend/models /app/models
COPY backend/reports /app/reports

# Copy required R and data files
COPY backend/score_Player.R /app/score_Player.R
COPY backend/model.rds /app/model.rds
COPY backend/dX.csv /app/dX.csv

# Copy dependency files
COPY backend/package*.json /app/

# Install Node packages
RUN npm install

# Expose app port
EXPOSE 10000

# Start server
CMD ["node", "server.js"]