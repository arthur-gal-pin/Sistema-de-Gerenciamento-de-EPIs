class EmailConfigs {
    public host = process.env.EMAIL_HOST || "";
    public port = Number(process.env.EMAIL_PORT) || 587; 
    public user = process.env.EMAIL_USER || "";
    public password = process.env.EMAIL_PASSWORD || "";
}

export default new EmailConfigs();