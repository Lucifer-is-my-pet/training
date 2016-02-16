use strict;
use warnings;
use File::Find;
#$\ = "\n";

# @ARGV = qw(.) unless @ARGV;
my @fileList = ();
find (\&wanted, './js');

sub wanted {
    if ($_ =~ /(.+\.js)/) {
        push @fileList, $File::Find::name;
    }
}; # /(.+\.txt)/ && print

#print(join ", ", @fileList);
my $out = '';

for my $file(@fileList) {
#    open OUTPUT, ">>", 'bundle.js';
    open my $text, "<", $file or die "Could not open file $file : $!";

    while (my $line = <$text>) {
      $out .= $line;
    }
    $out .= "\n";
}

open OUTPUT, '>', 'bundle.js';
print OUTPUT $out;