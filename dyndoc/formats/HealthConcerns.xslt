<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions" 
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3" 
    xmlns:dd="DynamicDocumentation"
    xmlns:java-string="java:java.lang.String"
    exclude-result-prefixes="xsl xs fn cdocfx n dd java-string">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
    
    <!-- required to include CommonFxn.xslt -->
    <!-- Comment this line to debug--> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
    <!--Uncomment this line to debug <xsl:include href="commonfxn.xslt" />-->
    
    <xsl:variable name="healthConcernDisplay" as="xs:string" select="'%s (%s)'"/>
    <xsl:variable name="commentDisplayFormat" as="xs:string" select="'Comments: %s'"/>
    
    <xsl:strip-space elements="n:comments"/>
    <xsl:template match="/">
        <xsl:if test="n:report/n:clinical-data/n:health-concern-data/n:health-concern">
        <ul style="list-style-type: disc; margin: 0; padding-left: 1em;">
            <xsl:for-each select="n:report/n:clinical-data/n:health-concern-data/n:health-concern">
                <!-- Sort by category text ascending, then sort by health concern description text ascending -->
                <xsl:sort select="cdocfx:getCodeDisplayByID(@category-code)" order="ascending"/>
                <xsl:sort select="n:description/text()" order="ascending"/>
                <li class="ddemrcontentitem ddremovable" dd:btnfloatingstyle="top-right" >
                        <xsl:attribute name="dd:entityid">
                            <xsl:value-of select="@health-concern-instance-uuid"/>
                        </xsl:attribute>
                        <xsl:attribute name="dd:contenttype">
                            <xsl:text>HEALTHCONCRN</xsl:text>
                        </xsl:attribute>
                        <div>
                        <xsl:variable name="categoryDisplay" as="xs:string">
                            <xsl:value-of select="cdocfx:getCodeDisplayByID(@category-code)"/>
                        </xsl:variable>
                        <xsl:variable name="descriptionDisplay" as="xs:string">
                            <xsl:value-of select="n:description/text()"/>
                        </xsl:variable>
                        <!-- Display the health concern description text followed by a dash and then the category in parantheses -->
                        <xsl:value-of select="java-string:format($healthConcernDisplay, ($descriptionDisplay, $categoryDisplay))"/>
                            <xsl:call-template name="tempDisplayComments"/>
					</div>
                </li>
            </xsl:for-each>
        </ul>
        </xsl:if>
    </xsl:template>
    
    <xsl:template name="tempDisplayComments">
        <!-- Verify comments exist, if they don't then display nothing-->
        <xsl:if test="not(empty(n:comments/text()))">
            <div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right" style="padding-left: 2em;text-indent: -1em;">
                <xsl:variable name="commentText" as="xs:string">
                    <xsl:value-of select="n:comments/text()"></xsl:value-of>
                </xsl:variable>
                <xsl:value-of select="java-string:format($commentDisplayFormat, ($commentText))"/>
            </div>
        </xsl:if>
    </xsl:template>
</xsl:stylesheet>