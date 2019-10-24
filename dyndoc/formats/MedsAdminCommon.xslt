<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    exclude-result-prefixes="xsl xs fn n cdocfx">
    
    <!-- required to include CommonFxn.xslt -->
    <!-- Comment this line to debug -->  <xsl:import href="/cernerbasiccontent/formats/commonfxn.xslt" />
    <!-- Uncomment this line to debug <xsl:import href="commonfxn.xslt" />-->
    
    <!-- This function processes MedsAdmin Node and returns list of order Ids  -->
    <!-- Parameters: -->
    <!--      medsAdminNode - MedsAdmin Node to be processed for order-ids-->
    <xsl:function name="cdocfx:getMedsAdminOrderIdList" as ="element()*">
        <xsl:param name="medsAdminNode"/>
        <xsl:variable name="medsAdminOrderIdsList" as="element()*">
            <xsl:if test="fn:exists($medsAdminNode/n:non-continuous-medication-administration)">
                <xsl:for-each select="$medsAdminNode/n:non-continuous-medication-administration">
                    <xsl:copy-of select="cdocfx:addOrderIdInList(.)"/>
                </xsl:for-each>	
            </xsl:if>
            <xsl:if test="fn:exists($medsAdminNode/n:continuous-medication-administration)">
                <xsl:for-each select="$medsAdminNode/n:continuous-medication-administration">
                    <xsl:copy-of select="cdocfx:addOrderIdInList(.)"/>
                </xsl:for-each>	
            </xsl:if>
        </xsl:variable>
        <xsl:copy-of select="$medsAdminOrderIdsList"/>
    </xsl:function>
    
    <!-- This function generates order element with order id from given continuous or non-continuous Meds Admin Node-->
    <!-- Order Id can be present as order-id or template-order-id attribute -->
    <!-- Parameters: -->
    <!--     medsAdminNode - medsAdmin node -->
    <xsl:function name="cdocfx:addOrderIdInList" as="element()*">
        <xsl:param name="medsAdminNode"/>
        <xsl:variable name="orderId" as="element()*">
            <!-- Order id can be present as order-id or template-order-id attribute in order element.So we have to handle both cases separately -->		
            <xsl:if test="fn:exists($medsAdminNode/n:order/@order-id) and $medsAdminNode/n:order/@order-id  &gt; 0">
                <order><xsl:value-of select="$medsAdminNode/n:order/@order-id"/></order>
            </xsl:if>
            <xsl:if test= "fn:exists($medsAdminNode/n:order/@template-order-id) and $medsAdminNode/n:order/@template-order-id &gt; 0">
                <order><xsl:value-of select="$medsAdminNode/n:order/@template-order-id"/></order>
            </xsl:if>
        </xsl:variable>
        <xsl:copy-of select="$orderId"/>
    </xsl:function>
    
    <!-- This function returns false if the current immunization node is having an order id and this order id is already part of the medsAdminOrderId list otherwise it returns true-->
    <!-- Parameters: -->
    <!--      immunizationNode - The imunnization for which the display qualification is to be returned. -->
    <!--      medsOrderIdsList-  The list which contains meds admin order ids -->
    <xsl:function name="cdocfx:shouldDisplayImmunization">
        <xsl:param name="immunizationNode"/>
        <xsl:param name="medsAdminOrderIdsList"/>
        <xsl:choose>
            <!-- Order id can be present as order-id or template-order-id attribute in order element.So we have to handle both cases separately -->		
            <xsl:when test="fn:exists($immunizationNode/n:order/@order-id)">
                <xsl:choose>
                    <xsl:when test="cdocfx:findIdInList($immunizationNode/n:order/@order-id,$medsAdminOrderIdsList)">
                        <xsl:copy-of select="fn:false()"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:copy-of select="fn:true()"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>	
            <xsl:when test="fn:exists($immunizationNode/n:order/@template-order-id)">
                <xsl:choose>
                    <xsl:when test="cdocfx:findIdInList($immunizationNode/n:order/@template-order-id,$medsAdminOrderIdsList)">
                        <xsl:copy-of select="fn:false()"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:copy-of select="fn:true()"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
                <xsl:copy-of select="fn:true()"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>	
</xsl:stylesheet>