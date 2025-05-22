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
    python3-pip

# Install modern R (>= 4.1) and GPG key directly
RUN apt-get update && \
    apt-get install -y gnupg curl software-properties-common dirmngr && \
    curl -fsSL https://cloud.r-project.org/bin/linux/debian/cran40.key | gpg --dearmor -o /etc/apt/trusted.gpg.d/cran.gpg && \
    echo "deb https://cloud.r-project.org/bin/linux/debian bullseye-cran40/" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y r-base
            
# Install Node.js (v18 LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Python packages (like matplotlib, pandas, PyMuPDF)
RUN pip3 install pandas matplotlib PyMuPDF

# Install R packages
RUN Rscript -e "install.packages(c('mirt', 'jsonlite'), repos='https://cloud.r-project.org')"

# Set working directory
WORKDIR /app

# Copy backend files
COPY . /app

# Install Node.js dependencies
RUN npm install

# Expose the port used by Render
EXPOSE 10000

# Start the backend
CMD ["node", "server.js"]