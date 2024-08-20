# install cron for postgresql 15  on the server 

cd  ~/beginnersAppDev

sudo apt-get install postgresql-15-cron ;

# create repository to store backups 
mkdir -p  /home/adminlocal/db_beginners/backup_bdd;

# create extension on bdd 
create extension if not exists pg_cron; 

# create schedule backup 

mkdir -p  /home/adminlocal/db_beginners/backup_bdd;

date=$(date '+%Y_%m_%d')

pg_dump -U user_beginners -d db_beginners  > /home/db_beginners/backup_bdd/backup_$date.sql