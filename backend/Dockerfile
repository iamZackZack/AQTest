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

# Install modern R (>= 4.1) from CRAN with working key
RUN apt-get update && \
    apt-get install -y curl gnupg dirmngr software-properties-common && \
    curl -fsSL https://cran.r-project.org/bin/linux/debian/marutter_pubkey.asc | gpg --dearmor -o /usr/share/keyrings/cran-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/cran-archive-keyring.gpg] https://cloud.r-project.org/bin/linux/debian bullseye-cran40/" > /etc/apt/sources.list.d/cran.list && \
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