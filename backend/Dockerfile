# Start from an official Debian image
FROM debian:bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    sudo \
    build-essential \
    software-properties-common \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    git \
    python3 \
    python3-pip \
    r-base

# Install Node.js (v18 LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Python packages (like matplotlib, pandas, PyMuPDF)
RUN pip3 install pandas matplotlib PyMuPDF

# Install R packages
RUN R -e "install.packages(c('mirt', 'jsonlite'), repos='https://cloud.r-project.org')"

# Set working directory
WORKDIR /app

# Copy backend files
COPY . /app

# Expose app port (adjust if needed)
EXPOSE 5001

# Start the backend
CMD ["node", "server.js"]