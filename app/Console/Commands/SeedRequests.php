<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SeedRequests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:requests';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed 100 sample requests into the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Seeding 100 requests...');
        
        $this->call('db:seed', [
            '--class' => 'Database\\Seeders\\RequestSeeder'
        ]);
        
        $this->info('✓ Successfully seeded 100 requests!');
        
        return 0;
    }
}
